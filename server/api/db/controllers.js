'use strict';

const exit = require('exit');

// Load class contructed
const peers = require('./mariadb');
// Load configs
const config = require('./../../../config/defaults');
// Load util to read db password from file
const { readFileTrim } = require('./../utils');

const retries = process.env.DB_CONN_RETRIES || config.mariaDB.retries;
let dbRetry = retries;

// Starts a MariaDB pool connection with class contructed
const connect = () =>
	require('mysql2/promise').createPool({
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

let db, connection;
const getConnection = () => {
	try {
		db = connect();
		dbRetry = 0;
		connection = new peers(db);
		console.log('Connected to MariaDB');
	} catch (err) {
		console.log(
			'Failed trying to establish connection to MariaDB. Trying again in 5 seconds...'
		);
		dbRetry--;
		const int = setInterval(() => {
			if (dbRetry > 0) {
				try {
					db = connect();
					dbRetry = 0;
					connection = new peers(db);
					console.log('Connected to MariaDB');
					clearInterval(int);
				} catch (err) {
					console.log(
						'Failed trying to establish connection to MariaDB. Trying again in 5 seconds...'
					);
					dbRetry--;
				}
			} else {
				// prettier-ignore
				console.log(
					'Failed trying to establish connection to MariaDB. Tried ' + retries + ' times. Exiting!'
				);
				clearInterval(int);
				exit(500);
			}
			dbRetry--;
		}, 5000);
	}
};
getConnection();
exports.cPeers = connection;
