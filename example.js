const Log = require('.')
// console.log(Log._readableState.pipes)
Log.info({message: 'This is a test', thid: 1 })

try {
  throw new Error('something bad happened')
} catch (error) {
  Log.error({ err: error })
}
