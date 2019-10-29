const ElasticsearchStream = require('../lib/ElasticsearchStream')

describe('ElasticsearchStream', () => {
  describe('_write', () => {
    it('builds and sends the properly formatted log line to ES', () => {
      const DummyESClient = {
        index: jest.fn((options, fn) => fn(null, { ok: true })),
        indices: {
          putTemplate: jest.fn((index, mappingTemplate) => Promise.resolve())
        }
      }
      const config = {
        client: DummyESClient,
        type: 'my_type',
        indexPattern: 'pattern-YYYY.MM.DD'
      }

      const logLine = {
        time: '2019-10-29T17:52:40.736Z',
        msg: 'log msg',
        level: 30,
        v: 'v',
        name: 'logger-name',
        pid: 123,
        hostname: 'pc'
      }

      const esSearchStream = new ElasticsearchStream(config)
      esSearchStream._write(JSON.stringify(logLine), 'utf-8', () => (true))

      expect(DummyESClient.index.mock.calls[0][0]).toEqual(expect.objectContaining({
        index: 'pattern-2019.10.29',
        type: config.type,
        body: {
          '@timestamp': logLine.time,
          message: logLine.msg,
          severity: 'info',
          fields: {
            hostname: logLine.hostname
          }
        }
      }))
    })

    describe('when an error ocurrs sending data to ES', () => {
      it('fails silently', () => {
        const DummyESClient = {
          index: (options, fn) => fn({ name: 'Error', message: 'Something bad happened' }),
          indices: {
            putTemplate: jest.fn((index, mappingTemplate) => Promise.resolve())
          }
        }
        const config = {
          client: DummyESClient,
          type: 'my_type',
          indexPattern: 'pattern-YYYY.MM.DD'
        }

        const logLine = {
          time: '2019-10-29T17:52:40.736Z',
          msg: 'log msg',
          level: 30,
          v: 'v',
          name: 'logger-name',
          pid: 123,
          hostname: 'pc'
        }

        const esSearchStream = new ElasticsearchStream(config)
        expect(() => {
          esSearchStream._write(JSON.stringify(logLine), 'utf-8', () => (true))
        }).not.toThrowError()
      })
    })
  })
})
