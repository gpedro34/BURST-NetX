'use strict';

exports.mariaDB = {
  "host": "localhost",          // default: 'localhost'
	"port": 3306,                 // default: 3306
	"name": "brs_crawler",        // default: 'brs_crawler'
	"user": "netX",               // default: 'NetX'
	"pass": "netX",               // default: 'NetX'
  "maxConnections": 10,         // default: 10
  "updateConstants": 10         // default 10 (minutes) - update scans and versions
};

exports.webserver = {
  "port": 5000,                 // default: 5000
  "limitPeersPerAPIcall": 25    // default 25 - max amount of results provided through API calls
};

// BRS related configuration
exports.brs = {
  "timeout": 10000,             // Default 10 sec
  "userAgent": 'BRS/9.9.9',     // Can be used to test how different wallets talk to each other
  "peerPort": 8123,             // Default peer port (default 8123)
  "apiPort": 8125               // Default api port (default 8125)
}
