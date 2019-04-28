'use strict';

// Load class contructed
const peers = require('./mariadb');
// Load configs
const config = require('./../../../config/defaults');
// Load util to read db password from file
const { readFileTrim } = require('./../utils');

// Starts a MariaDB pool connection with class contructed
const db = require('mysql2/promise').createPool({
	host: process.env.DB_HOST || config.mariaDB.host || 'localhost',
	port: process.env.DB_PORT || config.mariaDB.port || 3306,
	user: process.env.DB_USER || config.mariaDB.user || 'NetX',
	password:
		process.env.DB_PASS ||
		readFileTrim(__dirname + '/.db.passwd') ||
		config.mariaDB.pass ||
		'NetX',
	database: process.env.DB_NAME || config.mariaDB.name || 'brs_crawler',
	connectionLimit:
		process.env.DB_CON_LIMIT || config.mariaDB.maxConnections || 10
	// supportBigNumbers: true
});
exports.cPeers = new peers(db);
console.log('Connected to MariaDB');

// Export DB connection pool
module.exports = db;
