'use strict';

// Load defaults
const defaults = require('./../../config/defaults');

// Start Express App
const express = require('express');
const app = express();

// Middlewares
// CORS middleware
const cors = require('cors');
const corsOptions = require('./CORS');
app.use(cors(corsOptions.corsOptions));
//
// Loggers middlewares
// verify logger configuration variables
defaults.logger.mode = process.env.LOG_MODE || defaults.logger.mode;
defaults.logger.log = process.env.LOG || defaults.logger.log;
defaults.logger.interval = process.env.LOG_INTERVAL || defaults.logger.interval;
defaults.logger.size = process.env.LOG_SIZE || defaults.logger.size;
defaults.logger.compress = process.env.LOG_COMPRESS || defaults.logger.compress;
defaults.logger.maxSize = process.env.LOG_MAXSIZE || defaults.logger.maxSize;
defaults.logger.maxFiles = process.env.LOG_MAXFILES || defaults.logger.maxFiles;
defaults.logger.name = process.env.LOG_NAME || defaults.logger.name;
if (process.env.LOG_INFO) {
	defaults.logger.info = process.env.LOG_INFO.split(',');
}
if (process.env.LOG_REQ_HEAD) {
	defaults.logger.reqHeaders = process.env.LOG_REQ_HEAD.split(',');
}
if (process.env.LOG_RES_HEAD) {
	defaults.logger.resHeaders = process.env.LOG_RES_HEAD.split(',');
}
// Exceptions Middleware (not to log!)
const morgan = require('morgan');
app.use(
	morgan(defaults.logger.mode, {
		skip: (req, res) =>
			req._parsedUrl.path.indexOf('static') != -1 ||
			req._parsedUrl.path.indexOf('manifest') != -1 ||
			req._parsedUrl.path.indexOf('favicon') != -1 ||
			req._parsedUrl.path.indexOf('/css/') != -1 ||
			req._parsedUrl.path.indexOf('/js/') != -1 ||
			req._parsedUrl.path.indexOf('/img/') != -1 ||
			req._parsedUrl.path.indexOf('configs') != -1
	})
);
// Logs to file Middleware
if (defaults.logger.log) {
	const logs = require('./../logging/policy');
	let logInfo = '';
	if (defaults.logger.info[0]) {
		defaults.logger.info.forEach(el => {
			logInfo += '"' + el + '"';
			if (el != defaults.logger.info[defaults.logger.info.length - 1]) {
				logInfo += ',';
			} else if (defaults.logger.reqHeaders[0]) {
				defaults.logger.reqHeaders.forEach(el => {
					logInfo += '":req[' + el + ']"';
					if (
						el !=
						defaults.logger.reqHeaders[defaults.logger.reqHeaders.length - 1]
					) {
						logInfo += ',';
					} else if (defaults.logger.resHeaders[0]) {
						defaults.logger.resHeaders.forEach(el => {
							logInfo += '":res[' + el + ']"';
							if (
								el !=
								defaults.logger.resHeaders[
									defaults.logger.resHeaders.length - 1
								]
							) {
								logInfo += ',';
							}
						});
					}
				});
			}
		});
	}
	app.use(
		morgan(logInfo, {
			stream: logs.accessLogStream
		})
	);
}
//
// Parsers middlewares for incoming data
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//
// HTTPS redirect middleware (if SSL mode is enabled)
defaults.webserver.ssl = process.env.SSL || defaults.webserver.ssl;
app.use((req, res, next) => {
	// If ssl mode is enabled...
	if (req.protocol === 'http' && defaults.webserver.ssl) {
		if (req.headers.host.indexOf(':') >= 0) {
			req.headers.host = req.headers.host.slice(
				0,
				req.headers.host.indexOf(':')
			);
		}
		// redirect to HTTPS
		res.redirect(
			301,
			`https://${req.headers.host}:${defaults.webserver.sslPort}${req.url}`
		);
		return;
	} else {
		next();
	}
});

// API Routes
//
// Frontend served at http://domain:port/ if a frontendPath is provided
if (defaults.webserver.frontendPath) {
	app.get('/', app.use(express.static(defaults.webserver.frontendPath)));
}
// APi Docs at http://localhost:5000/docs
if (defaults.webserver.serveAPIDocsAt) {
	app.get(defaults.webserver.serveAPIDocsAt, (req, res) => {
		res.redirect(301, defaults.webserver.documentationURL);
	});
}
//
// Get multiple peers by ID (paginated) or all of them by Platform, Version or Height
const peersRoutes = require('./routes/peers');
app.get('/api/peers', (req, res) => {
	if (req.query.requestType === 'getPeersById') {
		req.params.requestType = req.query.requestType;
		if (req.query.start) {
			req.params.start = req.query.start;
		} else {
			req.params.start = 1;
		}
		if (
			req.query.howMany &&
			req.query.howMany >= 1 &&
			req.query.howMany <= defaults.webserver.limitPeersPerAPIcall
		) {
			req.params.howMany = req.query.howMany;
		} else {
			req.params.howMany = defaults.webserver.limitPeersPerAPIcall;
		}
		if (req.query.apiKey) {
			req.params.apiKey = req.query.apiKey;
		}
		if (req.query.completePeers) {
			req.params.completePeers = req.query.completePeers;
		}
	} else if (req.query.requestType === 'getPeersByPlatform') {
		req.params.requestType = req.query.requestType;
		if (req.query.id) {
			req.params.requestType = 'getPeersByPlatformId';
			req.query.id = Number(req.query.id);
			if (!isNaN(req.query.id) && req.query.id > 0) {
				if (Number.isInteger(req.query.id)) {
					req.params.id = req.query.id;
				} else {
					res.json({ error: "'id' must be an integer" });
					return;
				}
			} else {
				res.json({ error: "'id' must be a valid number" });
				return;
			}
		} else if (req.query.platform) {
			req.params.platform = req.query.platform;
		} else {
			res.json({
				error: "You need to specify either a 'platform' or 'id' in your query"
			});
			return;
		}
	} else if (req.query.requestType === 'getPeersByVersion') {
		req.params.requestType = req.query.requestType;
		if (req.query.id) {
			req.params.requestType = 'getPeersByVersionId';
			req.query.id = Number(req.query.id);
			if (!isNaN(req.query.id) && req.query.id > 0) {
				if (Number.isInteger(req.query.id)) {
					req.params.id = req.query.id;
				} else {
					res.json({ error: "'id' must be an integer" });
					return;
				}
			} else {
				res.json({ error: "'id' must be a valid number" });
				return;
			}
		} else if (req.query.version) {
			req.params.version = req.query.version;
		} else {
			res.json({
				error: "You need to specify either a 'version' or 'id' in your query"
			});
			return;
		}
	} else if (req.query.requestType === 'getPeersByHeight') {
		req.params.requestType = req.query.requestType;
		if (req.query.height) {
			req.query.height = Number(req.query.height);
			if (!isNaN(req.query.height)) {
				if (Number.isInteger(req.query.height)) {
					req.params.height = req.query.height;
				} else {
					res.json({ error: "'height' must be an integer" });
					return;
				}
			} else {
				res.json({ error: "'height' must be a number" });
				return;
			}
		} else {
			res.json({
				error: "You need to specify a starting 'height' in your query"
			});
			return;
		}
	}
	peersRoutes.peersGet(req, res);
});
//
// Get one peer by ID or address
const peerRoutes = require('./routes/peer');
app.get('/api/peer', (req, res) => {
	if (req.query.id) {
		req.query.id = Number(req.query.id);
		if (Number.isInteger(req.query.id) && req.query.id > 0) {
			req.params.id = req.query.id;
			peerRoutes.peerGet(req, res);
		} else {
			res.json({ error: "'id' must be a valid integer" });
			return;
		}
	} else if (req.query.address) {
		req.params.address = String(req.query.address);
		peerRoutes.peerGet(req, res);
	} else {
		res.json({
			error: "You must specify a valid 'id' or 'address' in your query"
		});
		return;
	}
});
//
// Search Engine Route - getAll routes (optional)
const getAllRoutes = require('./routes/getAll');
if (defaults.webserver.searchEngine.searchQueries) {
	// Get all from asked table
	app.get('/api/getAll', (req, res) => {
		if (
			req.query.from === 'platforms' ||
			req.query.from === 'versions' ||
			req.query.from === 'peers' ||
			req.query.from === 'scans' ||
			req.query.from === 'checks' ||
			req.query.from === 'locations' ||
			(req.query.from === 'ssl' &&
				req.query.where &&
				req.query.where != '' &&
				req.query.value &&
				req.query.value != '')
		) {
			getAllRoutes.allFrom(req, res);
		} else {
			res.json({
				error:
					"You must specify a valid 'from' query, being it 'platforms', 'versions', 'peers', 'scans', 'checks', 'locations' or 'ssl' aswell as a 'where' and a 'value' query. Check API documentation at https://watchdog.burst-alliance.org/docs"
			});
			return;
		}
	});
}

// Invalid routes middleware
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});
//
// Error responses middleware
// eslint no-unused-vars: "off"
app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
	return;
});

// Export App
module.exports = app;
