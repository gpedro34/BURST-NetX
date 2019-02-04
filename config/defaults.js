'use strict';

exports.mariaDB = {
  // MariaDB server connection configurations
  "host": "localhost",          // default: 'localhost'
  "port": 3306,                 // default: 3306
	"name": "brs_crawler",        // default: 'brs_crawler'
	"user": "netX",               // default: 'NetX'
	"pass": "netX",               // default: 'NetX'
  "maxConnections": 10         // default: 10
};

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
  "limitPeersPerAPIcall": 25,
};

exports.bundle = {
  // Default: "DEV" - will not load frontend as it has no build yet
  // Can also be "PROD" - will have frontend at domain root
  // served as static code from 'fe-build' folder
  "mode": "PROD"
};

// BRS related configuration
exports.brs = {
  // Default 10 sec - Timeout of API calls to BRS
  "timeout": 10000,
  // userAgent for BRS API calls
  // Can be used to test how different wallets talk to each other
  "userAgent": 'BRS/9.9.9',
  "peerPort": 8123,   // Default peer port (default 8123)
  "apiPort": 8125     // Default api port (default 8125)
}
