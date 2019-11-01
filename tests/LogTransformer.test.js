const LogTransformer = require('../lib/LogTransformer')

describe('LogTransformer', () => {
  it('builds a logstash compatible payload', () => {
    const input = {
      time: new Date().toISOString(),
      msg: 'log msg',
      level: 30,
      v: 'v',
      name: 'logger-name',
      pid: 123,
      hostname: 'pc',
      extraField: 'extra'
    }

    const output = LogTransformer.transform(input)

    expect(output).toEqual(expect.objectContaining({
      '@timestamp': input.time,
      message: input.msg,
      severity: 'info',
      fields: {
        extraField: input.extraField
      }
    }))
  })

  it('attaches aws lambda context variables', () => {
    process.env.AWS_REGION = 'us-east-1'
    process.env.AWS_LAMBDA_FUNCTION_NAME = 'my-function'
    process.env.AWS_LAMBDA_FUNCTION_VERSION = '$LATEST'
    process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE = '1024'
    process.env.AWS_EXECUTION_ENV = 'node10'
    process.env.STAGE = 'dev'

    const input = {
      time: new Date().toISOString(),
      msg: 'log msg',
      level: 30,
      v: 'v',
      name: 'logger-name',
      pid: 123,
      hostname: 'pc'
    }

    const output = LogTransformer.transform(input)

    expect(output).toEqual(
      expect.objectContaining({
        '@timestamp': input.time,
        message: input.msg,
        severity: 'info',
        autofields: {
          AWS_REGION: process.env.AWS_REGION,
          AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION,
          AWS_EXECUTION_ENV: process.env.AWS_EXECUTION_ENV,
          AWS_LAMBDA_FUNCTION_NAME: process.env.AWS_LAMBDA_FUNCTION_NAME,
          AWS_LAMBDA_FUNCTION_VERSION: process.env.AWS_LAMBDA_FUNCTION_VERSION,
          AWS_LAMBDA_FUNCTION_MEMORY_SIZE: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
          STAGE: process.env.STAGE
        }
      })
    )
    delete process.env.AWS_REGION
    delete process.env.AWS_LAMBDA_FUNCTION_NAME
    delete process.env.AWS_LAMBDA_FUNCTION_VERSION
    delete process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE
    delete process.env.STAGE
    delete process.env.AWS_EXECUTION_ENV
  })
})
