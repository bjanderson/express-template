'use strict';

var express = require('express'),
  bodyparser = require('body-parser'),
  server = express(),
  scribe = require('scribe-js')({rootPath: 'http-logs'}),
  console = process.console;


function httpServer(config) {
  var port = config.basePort + 80;

  // configure express to use the scribe logger
  server.use(scribe.express.logger());
  server.use('/http-logs', scribe.webPanel()); // access at http://localhost:[port]/logs

  //configure express to serve static files from the given directory
  server.use(express.static(__dirname + '/../client/public'));  

  //configure express to use body-parser
  server.use(bodyparser.json());
  server.use(bodyparser.raw());
  server.use(bodyparser.urlencoded({extended: true}));

  server.listen(port);

  console.log('Server started at http://localhost:' + port + '/');

  return server;
}

module.exports = httpServer;