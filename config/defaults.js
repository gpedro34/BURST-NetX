'use strict';
// Database Connection Configurations
exports.mariaDB = {
	// MariaDB server connection configurations
	host: 'localhost', // default: 'localhost'
	port: 3306, // default: 3306
	name: 'brs_crawler', // default: 'brs_crawler'
	user: 'brs_crawler', // default: 'NetX'
	pass: 'brs_crawler', // default: 'NetX'
	maxConnections: 10, // default: 10
	retries: 20
};
// Backend Configurations
exports.webserver = {
	// default: "DEV"     -> will whitelist undefined origins (undefined origins like some mobile browsers send will be accepted)
	// can also be "OPEN" -> will turn API public (accept all origins including undefined ones)
	// can also be "CLOSED" if you just want CORS to be open to whitelisted domains only (undefined origins will be blocked)
	modeCORS: 'OPEN',
	// add allowed CORS origins
	whitelistCORS: ['http://localhost:5000'],
	// default: 80
	port: 80,
	// SSL active by default on port 443
	/* Need to put the 'certificate.crt', 'ca_bundle.crt' and
   'private.key' inside '~/BURST-NetX/server/ssl/' folder */
	ssl: false,
	sslPort: 443,
	// frontendPath is a string with a relative path to the folder holding the static files
	frontendPath: false,
	// serveAPIDocs can be false if not to redirect to documentation page
	serveAPIDocsAt: '/docs',
	documentationURL: 'https://documenter.getpostman.com/view/4955736/RztoNUU6',
	// default 10 - max amount of results provided through API getPeersById
	limitPeersPerAPIcall: 10,
	searchEngine: {
		// getAll Queries
		searchQueries: true,
		/* Experimental mode
    Ok to run locally - Disabled by default
    Beaware that you will be performing a lot of calculations
    Were seen averages of 90 seconds to respond to
    getAll?from=peers&where=blocked&value=0&completePeers=true
    which returns all unblocked peers in DB
    with 7-days uptime, location, ssl and public API checks information */
		completePeers: true,
		authorizedAPIKeys: ['GENERATE_AND_INSERT_AN_AUTHORIZED_API_KEY_IN_HERE']
	}
};

// Logging Configurations
exports.logger = {
	// Console logging
	// Refer to https://www.npmjs.com/package/morgan
	mode: 'combined', // options: tiny, dev, combined, common, short
	// Log to file configurations
	// You should refer to https://www.npmjs.com/package/rotating-file-stream
	log: true, // true to log to ./server/logging/logs/ folder
	interval: '1h', // Use s,m,h,d,M for time units
	size: '10K', // Use B,K,M,G for size units (Single file)
	compress: false, // false or 'gzip' for data compression
	maxSize: '100M', // Use B,K,M,G for size units (Entire folder)
	maxFiles: 30, // Max number of log files to keep
	name: 'API', // Personalized files name to help with regex and wildcards
	// Information to include in the logger to file.
	// You should refer to https://www.npmjs.com/package/morgan (tokens usage)
	info: [
		':remote-addr', // IP address
		':remote-user', // User logged with Basic Auth
		':date[web]', // Date (clf, iso, web formats)
		':method', // Req Method
		':url', // URL queried
		'HTTP/:http-version', // Req HTTP Version
		':status', // Response Status
		':response-time ms', // Response time
		':res[content-length]', // Response content length
		':referrer', // Req Origin
		':user-agent' // Req userAgent
	],
	// Request headers to add to logger to file. Just strings with name of the headers
	reqHeaders: [],
	// Response headers to add to logger to file. Just strings with name of the headers
	resHeaders: []
};

// BRS related Configurations
exports.brs = {
	// Default 10 sec - Timeout of API calls to BRS
	timeout: 10000,
	// userAgent for BRS API calls
	// Can be used to test how different wallets talk to each other
	userAgent: 'BRS/9.9.9',
	peerPort: 8123, // Default peer port (default 8123)
	apiPort: 8125 // Default api port (default 8125)
};
