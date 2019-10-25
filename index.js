const es = require('elasticsearch')
const winston = require('winston')
const Elasticsearch = require('winston-elasticsearch')
const AWSESConnection = require('http-aws-es')
const lambdaLogTransformer = require('./lambdaLogTransformer')

const DEFAULT_LOG_LEVEL = 'info'
const LOG_INDEX_PREFIX = 'logs'
const LOG_INDEX_SUFFIX_PATTERN = 'YYYY.MM.DD'
const ES_DEFAULT_REGION = process.env.AWS_REGION

const elasticsearchAWSClientOptions = {
  hosts: [process.env.ES_HOST],
  connectionClass: AWSESConnection,
  awsConfig: new AWS.Config({ region: process.env.ES_REGION || ES_DEFAULT_REGION }),
}

const elasticsearchClientOptions = {
  hosts: [process.env.ES_URI]
}

const elasticsearchClient = () => {
  if (process.env.ES_REGION) {
    return es.Client(elasticsearchAWSClientOptions) 
  }
  return es.Client(elasticsearchClientOptions)
} 

const defaultOptions = {
  level: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL,
  indexPrefix: process.env.LOG_INDEX_PREFIX || LOG_INDEX_PREFIX,
  indexSuffixPattern: process.env.LOG_INDEX_SUFFIX_PATTERN || LOG_INDEX_SUFFIX_PATTERN,
  transformer: lambdaLogTransformer,
  ensureMappingTemplate: true,
  client = elasticsearchClient()
}

const Log = winston.createLogger({
  transports: [
    new Elasticsearch(defaultOptions)
  ]
})

module.exports = Log
