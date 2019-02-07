'use strict';
// Database Connection Configurations
exports.mariaDB = {
  // MariaDB server connection configurations
  "host": "localhost",          // default: 'localhost'
  "port": 3306,                 // default: 3306
	"name": "brs_crawler",        // default: 'brs_crawler'
	"user": "netX",               // default: 'NetX'
	"pass": "netX",               // default: 'NetX'
  "maxConnections": 10         // default: 10
};
// Backend Configurations
exports.webserver = {
  // default: "DEV"     -> will whitelist undefined origins
  // can also be "OPEN" -> will turn API public
  // leave "" if you just want CORS to be open to whitelisted domains
  "mode": "DEV",
  // add allowed CORS origins
  "whitelistCORS": [
    'http://localhost:5000'
  ],
  // default: 5000
  "port": 5000,
  // default 25 - max amount of results provided through API getPeersById
  "limitPeersPerAPIcall": 25
};
// Bundle Backend + Frontend Configurations
exports.bundle = {
  // Default: "DEV" - will not load frontend as it has no build yet
  // Can also be "PROD" - will have frontend at domain root
  // served as static code from 'fe-build' folder
  "mode": "PROD"
};
// BRS related Configurations
exports.brs = {
  // Default 10 sec - Timeout of API calls to BRS
  "timeout": 10000,
  // userAgent for BRS API calls
  // Can be used to test how different wallets talk to each other
  "userAgent": 'BRS/9.9.9',
  "peerPort": 8123,   // Default peer port (default 8123)
  "apiPort": 8125     // Default api port (default 8125)
}
// Logging Configurations
exports.logger = {
  // Console logging
  // Refer to https://www.npmjs.com/package/morgan
  "mode": 'dev',            // options: tiny, dev, combined, common, short
  // Log to file configurations
  // You should refer to https://www.npmjs.com/package/rotating-file-stream
  "log": false,              // true to log to ./server/logging/logs/ folder
  "interval": '1d',         // Use s,m,h,d,M for time units
  "size": '10K',            // Use B,K,M,G for size units (Single file)
  "compress": false,        // false or 'gzip' for data compression
  "maxSize": '100M',        // Use B,K,M,G for size units (Entire folder)
  "maxFiles": 30,           // Max number of log files to keep
  "name": 'API',            // Personalized files name to help with regex and wildcards
  // Information to include in the logger to file.
  // You should refer to https://www.npmjs.com/package/morgan (tokens usage)
  "info": [
    ":date[web]",           // Date (clf, iso, web formats)
    ":method",              // Req Method
    ":url",                 // URL queried
    "HTTP/:http-version",   // Req HTTP Version
    ":status",              // Response Status
    ":response-time ms",    // Response time
    ":res[content-length]", // Response content length
    ":referrer",            // Req Origin
    ":user-agent"           // Req userAgent
  ],
  // Request headers to add to logger to file. Just strings with name of the headers
  "reqHeaders":[

  ],
  // Response headers to add to logger to file. Just strings with name of the headers
  "resHeaders":[

  ]
}
