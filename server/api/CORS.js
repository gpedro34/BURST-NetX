'use strict';

// Load defaults
const defaults = require('./../../config/defaults');

// CORS Whitelists
defaults.webserver.modeCORS =
	process.env.CORS_MODE || defaults.webserver.modeCORS;
const allowedOrigins = defaults.webserver.whitelistCORS;
if (process.env.CORS_WHITELIST) {
	if (process.env.DOMAIN_FE) {
		allowedOrigins.push(process.env.DOMAIN_FE);
	}
	if (process.env.CORS_WHITELIST) {
		defaults.webserver.whitelistCORS = process.env.CORS_WHITELIST.split(',');
	}
	defaults.webserver.whitelistCORS.forEach(el => {
		allowedOrigins.push(el);
	});
}

// CORS SETUP
exports.corsOptions = {
	origin: function(origin, callback) {
		if (defaults.webserver.modeCORS === 'OPEN') {
			// Public API - Allow all origins
			return callback(null, true);
		} else if (defaults.webserver.modeCORS === 'DEV') {
			// Allows mobile and Postman calls
			if (origin === undefined) {
				return callback(null, true);
			}
		} else if (
			defaults.webserver.modeCORS === 'CLOSED' &&
			origin &&
			allowedOrigins.indexOf(origin) === -1
		) {
			// Block Request
			const msg =
				"CORS policy for this site doesn't allow access from the specified Origin";
			return callback(new Error(msg), false);
		}
		// allow requests with no origin
		// (like mobile apps or curl requests)
		// if(!origin) return callback(null, true);
		return callback(null, true);
	}
};
