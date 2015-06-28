var http = require('./http'),
  https = require('./https'),
  config = {
    basePort: 20000 // note: http will be at port 20080 and https will be at port 20443
  },
  httpServer = http(config),
  httpsServer = https(config),
  scribe = require('scribe-js')(),
  console = process.console;

