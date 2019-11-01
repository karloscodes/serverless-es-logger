[![npm version](https://badge.fury.io/js/serverless-es-logger.svg)](https://badge.fury.io/js/serverless-es-logger)

# serverless-es-logger

A simple logger for AWS Lambda that sends logs directly to Elasticsearch instead of Cloudwatch.

## Features

- It's a Bunyan logger (see what it is supported [here](https://github.com/trentm/node-bunyan)
- Configurable via environment variables
- Auto attaches AWS Lambda environment variables such as `AWS_REGION`, `AWS_LAMBDA_FUNCTION_NAME`, `STAGE` etc.
- Works with the AWS Elasticsearch Service and other providers. Versions 6.x and 7.x are supported.
- Compatible with Kibana (search, filter, aggregate and create dashboards with your log data)

## Installation

With npm:

```
npm i --save serverless-es-logger
```

With yarn:

```
yarn add serverless-es-logger
```

## Configuration

### Index configuration

`ES_INDEX_TYPE`: `(optional)` The type used for the indexed docs. `default:` _doc

`ES_INDEX_PATTERN`: `(optional)` The pattern used to create indexes in ES. `default:` logstash-YYYY.MM.DD

### Connection configuration for the AWS Elasticsearch Service

`ES_DOMAIN_ENDPOINT`: `(required)` The domain's endpoint

`ES_REGION`: `(optional)` The AWS region where the domain is hosted. `default:` the current AWS_REGION

### Connection configuration for other providers

`ES_URI`: `(required)` The Elasticsearch connection URI

## Usage

Simple, just require and use it

```javascript
const Log = require('serverless-es-logger')

Log.info({ message: 'This is a test' })

try {
  throw new Error('Something bad happened')
} catch (error) {
  Log.error({ err: error })
}
```

*Notice that for errors the field `err` is recommended to be used so the error details are extracted and included in the log context.*

Send messages like the following:

```json
{
  "@timestamp": "2019-11-01T10:28:13.598Z",
  "message": "This is a test",
  "severity": "info",
  "fields": {
    "message": "This is a test"
  },
  "autofields": {
    "AWS_REGION": "us-east-1",
    "AWS_EXECUTION_ENV": "node10",
    "AWS_LAMBDA_FUNCTION_NAME": "my-function",
    "AWS_LAMBDA_FUNCTION_VERSION": "$LATEST",
    "AWS_LAMBDA_FUNCTION_MEMORY_SIZE": "1024",
    "STAGE": "dev"
  }
},
{
  "@timestamp": "2019-11-01T10:28:13.607Z",
  "message": "Something bad happened",
  "severity": "error",
  "fields": {
    "err": {
      "message": "Something bad happened",
      "name": "Error",
      "stack": "... the stack trace ..."
    }
  },
  "autofields": {
    "AWS_REGION": "us-east-1",
    "AWS_EXECUTION_ENV": "node10",
    "AWS_LAMBDA_FUNCTION_NAME": "my-function",
    "AWS_LAMBDA_FUNCTION_VERSION": "$LATEST",
    "AWS_LAMBDA_FUNCTION_MEMORY_SIZE": "1024",
    "STAGE": "dev"
  }
}
```

## <a name="license"></a>License

ISC © [Carlos Castellanos](https://github.com/ccverak)
