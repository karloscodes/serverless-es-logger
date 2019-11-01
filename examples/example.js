process.env.ES_URI = 'http://localhost:9200'
process.env.AWS_REGION = 'us-east-1'
process.env.AWS_LAMBDA_FUNCTION_NAME = 'my-function'
process.env.AWS_LAMBDA_FUNCTION_VERSION = '$LATEST'
process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE = '1024'
process.env.AWS_EXECUTION_ENV = 'node10'
process.env.STAGE = 'dev'

const Log = require('../')

Log.info({ message: 'This is a test' })

try {
  throw new Error('Something bad happened')
} catch (error) {
  Log.error({ err: error })
}
