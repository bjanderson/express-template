var express = require('express'),
    bodyparser = require('body-parser'),
    fs = require('fs'),
    https = require('https'),
    server = express();

function httpsServer(config) {
  console.log(' ');
  console.log(config);
  var port = config.basePort + 443,
    httpsOptions = {
      key: fs.readFileSync('server/ssl/server.key'),
      cert: fs.readFileSync('server/ssl/server.crt'),
      ca: [fs.readFileSync('server/ssl/ca.crt')],
      requestCert: true,
      rejectUnauthorized: true,
      agent: false,

      // This is the password that was used to create the server's certificate.
      // Located in the ssl/passphrase file
      passphrase: '1234'
    };
  console.log('port: ' + port);

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
  server.use(authChecker);

  // Create and start the https server
  https.createServer(httpsOptions, server).listen(port, function () {
      console.log(' ');
      console.log('Server listening at https://localhost:' + port + '/');
  });

  return server;
}

/**
    Check the user certificate authorization to determine if the user can access the requested resource or not
*/
function authChecker(req, res, next) {
    console.log(' ');
    console.log('-----------------------------------');
    console.log('Auth Checker');
    console.log('authorized: ' + req.client.authorized);
    console.log('req.url: ' + req.url);

    //throw new Error();    //returns a 500 error from the server

    if(req.client.authorized === true) {
        console.log('authChecker - authorized');
        next();
    } else {
        console.log('authChecker - 401');
        res.status(401).json({error: 'Not Authorized.'});
    }

    console.log('-----------------------------------');
    console.log(' ');
}


module.exports = httpsServer;