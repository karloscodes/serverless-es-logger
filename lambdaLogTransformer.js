/**
 Transformer function to transform log data as provided by winston into
 a message structure which is more appropriate for indexing in ES.
 @param {Object} logData
 @param {Object} logData.message - the log message
 @param {Object} logData.level - the log level
 @param {Object} logData.meta - the log meta data (JSON object)
 @returns {Object} transformed message
 */

const awsLambdaFields = {
  awsRegion: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
  functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
  functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION,
  functionMemorySize: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
  environment: process.env.ENVIRONMENT || process.env.STAGE
}

const lambdaLogTransformer = function lambdaLogTransformer (logData) {
  const transformed = {}
  const fields = {
    ...logData.meta,
    ...awsLambdaFields,
    ...global.CORRELATION_IDS
  }
  transformed['@timestamp'] = logData.timestamp ? logData.timestamp : new Date().toISOString()
  transformed.message = logData.message
  transformed.severity = logData.level
  transformed.fields = fields
  return transformed
}

module.exports.lambdaLogTransformer = lambdaLogTransformer
