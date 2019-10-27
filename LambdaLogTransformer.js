const levels = {
  10: 'trace',
  20: 'debug',
  30: 'info',
  40: 'warn',
  50: 'error',
  60: 'fatal'
}

const awsLambdaFields = {
  awsRegion: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
  functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
  functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION,
  functionMemorySize: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
  environment: process.env.ENVIRONMENT || process.env.STAGE
}

const extractLogFields = (logData) => {
  const ignoredFields = ['v', 'name', 'pid', 'time', 'level', 'msg']
  return Object.keys(logData).reduce((object, key) => {
    if (!ignoredFields.include(key)) {
      object[key] = logData[key]
    }
    return object
  }, {})
}

const lambdaLogTransformer = function lambdaLogTransformer (logData) {
  const fields = {
    ...awsLambdaFields,
    ...logData,
    ...extractLogFields(logData)
  }

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
