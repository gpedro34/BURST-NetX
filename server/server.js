'use strict';

var exit = require('exit');

const app = require('./api/api');
const control = require('./api/db/controllers');

// Start the server
const port = process.env.PORT || require('./../config/defaults').webserver.port || 5000;
const server = app.listen(port, () => {
  console.log('Server is listening on port '+port);
  control.launch();
});

process.on('SIGINT', () => {
	console.log(`Shutting down webserver...`);
  server.close();
  exit(0);
});

process.on('SIGTERM', () => {
	console.log(`Shutting down webserver and DB connection...`);
  server.close();
	exit(0);
});
