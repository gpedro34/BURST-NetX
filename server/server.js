'use strict';
const exit = require('exit');

const app = require('./api/api');
const def = require('./../config/defaults');

// Start the webservers
const port = process.env.PORT || def.webserver.port || 5000;
let httpsServer;
const server = app.listen(port, () => {
	console.log('HTTP server is listening on port ' + port);
	// HTTPS webserver
	if (def.webserver.ssl) {
		const fs = require('fs');
		const https = require('https');
		// Check for certificates and key
		if (
			fs.existsSync('./server/ssl/certificate.crt') &&
			fs.existsSync('./server/ssl/ca_bundle.crt') &&
			fs.existsSync('./server/ssl/private.key')
		) {
			// Load files
			const httpsOptions = {
				cert: fs.readFileSync('./server/ssl/certificate.crt'),
				ca: fs.readFileSync('./server/ssl/ca_bundle.crt'),
				key: fs.readFileSync('./server/ssl/private.key')
			};
			// Start HTTPS webserver
			httpsServer = https
				.createServer(httpsOptions, app)
				.listen(def.webserver.sslPort);
			console.log('HTTPS Server is listening on port ' + def.webserver.sslPort);
			console.log(
				`Redirecting all requests from HTTP(${port}) to HTTPS(${
					def.webserver.sslPort
				})`
			);
		} else {
			// No SSL files in ./server/ssl
			/* Files needed in ./server/ssl/ folder:
          - certificate.crt
          - ca_bundle.crt
          - private.key
      */
			console.error('Something went wrong with the SSL files');
		}
	}
});

// Close program
const killAll = () => {
	console.log('Shutting down webservers...');
	// Close HTTP webserver
	server.close();
	// If there is a HTTPS webserver, kill it
	if (httpsServer) {
		httpsServer.close();
	}
	// End of program
	exit(0);
};
process.on('SIGINT', killAll);
process.on('SIGTERM', killAll);
