'use strict';

var express = require('express'),
    bodyparser = require('body-parser'),
    server = express();


function httpServer(config) {
  var port = config.basePort + 80;

  console.log(' ');
  console.log('__dirname ' + __dirname);
  console.log(' ');

  //configure express to serve static files from the given directory
  if (config.env === 'dist') {
    console.log('serving /dist');
    server.use(express.static(__dirname + '/../dist'));
  } else {
    console.log('serving /client');
    server.use(express.static(__dirname + '/../client'));  
  }

  //configure express to use body-parser
  server.use(bodyparser.json());
  server.use(bodyparser.raw());
  server.use(bodyparser.urlencoded({extended: true}));

  server.listen(port);

  console.log('Server started at http://localhost:' + port + '/');

  return server;
}

module.exports = httpServer;