var http = require('./servers/http'),
  https = require('./servers/https'),
  config = require('./config/dev'),
  httpServer = http(config),
  httpsServer = https(config),
  scribe = require('scribe-js')(),
  console = process.console;

