/**
 Transformer function to transform log data as provided by winston into
 a message structure which is more appropriate for indexing in ES.
 @param {Object} logData
 @param {Object} logData.message - the log message
 @param {Object} logData.level - the log level
 @param {Object} logData.meta - the log meta data (JSON object)
 @returns {Object} transformed message
 */

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

const lambdaLogTransformer = function lambdaLogTransformer (logData) {
  console.log({ logData })
  const transformed = {}
  const fields = {
    // ...logData.meta[Symbol('message')],
    ...awsLambdaFields,
    ...logData
  }

  delete fields.v
  delete fields.name
  delete fields.pid
  delete fields.time
  delete fields.level
  delete fields.msg 

  transformed['@timestamp'] = logData.time ? logData.time : new Date().toISOString()
  transformed.message = logData.msg || logData.message || (logData.err || {}).message
  transformed.severity = levels[logData.level]
  transformed.fields = fields
  return transformed
}

module.exports = {
  transform: lambdaLogTransformer
}
