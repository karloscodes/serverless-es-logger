const AWS = require('aws-sdk')
const es = require('elasticsearch')
const bunyan = require('bunyan')
const ElasticsearchStream = require('./ElasticsearchStream')
const AWSESConnection = require('http-aws-es')

const elasticsearchAWSClientOptions = {
  hosts: [process.env.ES_DOMAIN_ENDPOINT],
  connectionClass: AWSESConnection,
  awsConfig: new AWS.Config({ region: process.env.ES_REGION }),
  requestTimeout: 5000,
  maxRetries: 3,
  log: null
}

const elasticsearchClientOptions = {
  hosts: [process.env.ES_URI],
  log: null
}

const elasticsearchClient = () => {
  if (process.env.ES_DOMAIN_ENDPOINT) {
    console.log(elasticsearchAWSClientOptions)
    return es.Client(elasticsearchAWSClientOptions)
  }
  return es.Client(elasticsearchClientOptions)
}

const defaultOptions = {
  client: elasticsearchClient(),
  indexType: process.env.ES_INDEX_TYPE || 'logs',
  indexPattern: process.env.ES_INDEX_PATTERN || 'logstash-YYYY.MM.DD'
}

const Log = bunyan.createLogger({
  name: 'lamnda-es-logger',
  streams: [
    { stream: new ElasticsearchStream(defaultOptions) }
  ],
  serializers: bunyan.stdSerializers,
  level: process.env.LOG_LEVEL || 'info'
})

module.exports = Log
