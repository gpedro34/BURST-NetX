'use strict';

exports.mariaDB = {
  "host": "localhost",          // default: 'localhost'
	"port": 3306,                 // default: 3306
	"name": "brs_crawler",        // default: 'NetX'
	"user": "netX",               // default: 'NetX'
	"pass": "netX",               // default: 'NetX'
  "maxConnections": 10,         // default: 10
  "updateConstants": 10         // default 10 (minutes) - update scans and versions
};

exports.webserver = {
  "port": 3000                  // default: 3000
};
