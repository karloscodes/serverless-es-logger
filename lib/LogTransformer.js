const omit = require('lodash.omit')
const omitEmpty = require('omit-empty')
let CorrelationIds
try {
  CorrelationIds = require('@dazn/lambda-powertools-correlation-ids')
} catch (error) {}

const levels = {
  10: 'trace',
  20: 'debug',
  30: 'info',
  40: 'warn',
  50: 'error',
  60: 'fatal'
}

const extractLogFields = (logData) => {
  const ignoredFields = ['v', 'name', 'pid', 'time', 'level', 'msg', 'hostname']
  return omit(logData, ignoredFields)
}

const extractAwsLambdaFields = () => {
  return {
    AWS_REGION: process.env.AWS_REGION,
    AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION,
    AWS_EXECUTION_ENV: process.env.AWS_EXECUTION_ENV,
    AWS_LAMBDA_FUNCTION_NAME: process.env.AWS_LAMBDA_FUNCTION_NAME,
    AWS_LAMBDA_FUNCTION_VERSION: process.env.AWS_LAMBDA_FUNCTION_VERSION,
    AWS_LAMBDA_FUNCTION_MEMORY_SIZE: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
    ENVIRONMENT: process.env.ENVIRONMENT,
    ENV: process.env.ENV,
    STAGE: process.env.STAGE,
    ...CorrelationIds.get()
  }
}

const lambdaLogTransformer = function lambdaLogTransformer (logData) {
  const transformed = omitEmpty({
    '@timestamp': logData.time ? logData.time : new Date().toISOString(),
    message: logData.msg || logData.message || (logData.err || {}).message,
    severity: levels[logData.level],
    geolocation: logData.geolocation || logData.geoLocation,
    fields: extractLogFields(logData),
    autofields: extractAwsLambdaFields()
  })
  return transformed
}

module.exports = {
  transform: lambdaLogTransformer
}
