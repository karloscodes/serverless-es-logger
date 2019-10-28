const LogTransformer = require('../LogTransformer')

describe('Log transformation', () => {
  it('builds a logstash compatible payload', () => {
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

    expect(output).toEqual(expect.objectContaining({
      '@timestamp': input.time,
      message: input.msg,
      severity: 'info',
      fields: {
        hostname: input.hostname
      }
    }))
  })

  it('attaches aws lambda context variables', () => {
    process.env.AWS_REGION = 'us-east-1'
    process.env.AWS_LAMBDA_FUNCTION_NAME = 'my-function'
    process.env.AWS_LAMBDA_FUNCTION_VERSION = '$LATEST'
    process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE = '1024'
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
        fields: {
          hostname: input.hostname,
          awsRegion: process.env.AWS_REGION,
          functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
          functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION,
          functionMemorySize: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
          environment: process.env.STAGE
        }
      })
    )
    delete process.env.AWS_REGION
    delete process.env.AWS_LAMBDA_FUNCTION_NAME
    delete process.env.AWS_LAMBDA_FUNCTION_VERSION
    delete process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE
    delete process.env.STAGE
  })
})
