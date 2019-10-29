const Log = require('../')

Log.info({ message: 'This is a test', thid: 1 })

try {
  throw new Error('something bad happened')
} catch (error) {
  Log.error({ err: error })
}
