const Writable = require('stream').Writable
const dayjs = require('dayjs')
const defaultMappingTemplate = require('./index-template-mapping.json')
const defaultTransformer = require('./lambdaLogTransformer')

function generateIndexName (pattern, entry) {
  const [prefix, datePattern] = pattern.split('-')
  return [prefix, dayjs(entry.time).format(datePattern)].join('-')
}

function callOrString (value, entry) {
  if (typeof value === 'function') {
    return value(entry)
  }
  return value
}

class ElasticsearchStream extends Writable {
  constructor (options) {
    super(options)
    options = options || {}
    this._client = options.client
    this._type = options.type || 'logs'
    this._indexPattern = options.indexPattern
    this._index = generateIndexName.bind(null, this._indexPattern)
    this._writeCallback = options.writeCallback
    this._transformer = options.transformer || defaultTransformer
    this._mappingTemplate =
      !options.mappingTemplate || options.mappingTemplate === true
        ? defaultMappingTemplate
        : options.mappingTemplate

    // async
    this.putMappingTemplate(this._index, this._mappingTemplate)
  }

  putMappingTemplate (name, mappingTemplate) {
    if (mappingTemplate === false) return

    mappingTemplate.index_patterns = [this._indexPattern]

    return this._client.indices.putTemplate({
      name: 'lambda-es-logger-logstash-template',
      create: false, // can replace a previous one
      body: mappingTemplate
    })
  }

  _write (entry, encoding, callback) {
    const client = this._client
    const index = this._index
    const type = this._type

    const input = JSON.parse(entry.toString('utf8'))

    const output = this._transformer.transform(input)

    // if (this._writeCallback) {
    //   output = this._writeCallback(output, input) || output
    // }

    console.log(callOrString(index, input))
    const options = {
      index: callOrString(index, input),
      type: callOrString(type, input),
      body: output
    }

    const self = this
    client.index(options, function (err) {
      if (err) {
        self.emit('error', err)
      }
      callback()
    })
  }
}

module.exports = ElasticsearchStream
