const omit = require('lodash.omit')
const omitEmpty = require('omit-empty')

const levels = {
  10: 'trace',
  20: 'debug',
  30: 'info',
  40: 'warn',
  50: 'error',
  60: 'fatal'
}

const extractLogFields = (logData) => {
  const ignoredFields = ['v', 'name', 'pid', 'time', 'level', 'msg']
  return omit(logData, ignoredFields)
}

const lambdaLogTransformer = function lambdaLogTransformer (logData) {
  const awsLambdaFields = {
    awsRegion: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
    awsExecutionEnv: process.env.AWS_EXECUTION_ENV,
    functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
    functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION,
    functionMemorySize: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
    environment: process.env.ENVIRONMENT || process.env.STAGE
  }

  const fields = omitEmpty({
    ...awsLambdaFields,
    ...extractLogFields(logData)
  })

  const transformed = {
    '@timestamp': logData.time ? logData.time : new Date().toISOString(),
    message: logData.msg || logData.message || (logData.err || {}).message,
    severity: levels[logData.level],
    fields: fields
  }
  return transformed
}

module.exports = {
  transform: lambdaLogTransformer
}
