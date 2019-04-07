'use strict';

const exit = require('exit');

const app = require('./api/api');
const control = require('./api/db/controllers');

// Start the server
const port = process.env.PORT || require('./../config/defaults').webserver.port || 5000;
const server = app.listen(port, () => {
  console.log('HTTP server is listening on port '+port);
  // SSL
  if(require('./../config/defaults').bundle.ssl){
    const fs = require('fs');
    const https = require('https');
    if(fs.existsSync('./server/ssl/certificate.crt') && fs.existsSync('./server/ssl/ca_bundle.crt') && fs.existsSync('./server/ssl/private.key')){
      const httpsOptions = {
        cert: fs.readFileSync('./server/ssl/certificate.crt'),
        ca: fs.readFileSync('./server/ssl/ca_bundle.crt'),
        key: fs.readFileSync('./server/ssl/private.key')
      }
      const httpsServer = https.createServer(httpsOptions, app).listen(require('./../config/defaults').bundle.sslPort);
      console.log('HTTPS Server is listening on port '+require('./../config/defaults').bundle.sslPort);
      console.log(`Redirecting all requests from HTTP(${port}) to HTTPS(${require('./../config/defaults').bundle.sslPort})`);
    } else {
      console.error('Something went wrong with the SSL files');
    }
  }
});

process.on('SIGINT', () => {
	console.log(`Shutting down webservers...`);
  server.close();
  if(httpsServer){
    httpsServer.close();
  }
  exit(0);
});

process.on('SIGTERM', () => {
	console.log(`Shutting down webservers...`);
  server.close();
  if(httpsServer){
    httpsServer.close();
  }
	exit(0);
});
