[![npm version](https://badge.fury.io/js/serverless-es-logger.svg)](https://badge.fury.io/js/serverless-es-logger)

# serverless-es-logger

A simple logger for AWS Lambda that sends logs directly to Elasticsearch instead of Cloudwatch.

## Features

- Bunyan compatible (see [here](https://github.com/trentm/node-bunyan) what it is supported)
- Configurable via environment variables
- Attaches AWS Lambda context variables to the log lines such as, `AWS_REGION`, `functionName`, `functionVersion`, `functionMemorySize` and `stage`
- Works with the AWS Elasticsearch Service and other providers
- Compatible with Kibana

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

`ES_INDEX_TYPE`: `(optional)` The type used for the indexed docs. `default:` log

`ES_INDEX_PATTERN`: `(optional)` The pattern used to create indexes in ES. `default:` logstash-YYYY.MM.DD

### Connection configuration for the AWS Elasticsearch Service

`ES_DOMAIN_ENDPOINT`: `(required)` The domain's endpoint

`ES_REGION`: `(optional)` The AWS region where the domain is hosted. `default:` the current AWS_REGION

### Connection configuration for other providers

`ES_URI`: `(required)` The elasticsearch connection URI

## Usage

Simple, just require and use it

```javascript
const Log = require('serverless-es-logger')

Log.info({ message: 'This is a test', thid: 1 })

try {
  throw new Error('something bad happened')
} catch (error) {
  Log.error({ err: error })
}
```

Send messages like the following:

```json
{
  "@timestamp": "2019-10-29T18:25:56.089Z",
  "message": "This is a test",
  "severity": "info",
  "fields": {
    "awsRegion": "us-east-1",
    "functionName": "my-function",
    "functionVersion": "$LATEST",
    "functionMemorySize": "1024",
    "environment": "dev",
    "hostname": "pc",
    "thid": 1
  }
}
```

## <a name="license"></a>License

ISC © [Carlos Castellanos](https://github.com/ccverak)
