'use strict';

const peers = require('./mariadb');
const config = require('./../../../config/defaults');
const utils = require('./../utils');

const self = require('./controllers');

const db = require('mysql2/promise').createPool({
	host: process.env.DB_HOST || config.mariaDB.host || 'localhost',
	port: process.env.DB_PORT || config.mariaDB.port || 3306,
	user: process.env.DB_USER || config.mariaDB.user || 'NetX',
	password: process.env.DB_PASS || utils.readFileTrim(__dirname + '/.db.passwd') || config.mariaDB.pass || 'NetX',
	database: process.env.DB_NAME || config.mariaDB.name || 'NetX',
	connectionLimit: process.env.DB_CON_LIMIT || config.mariaDB.maxConnections || 10,
	//supportBigNumbers: true
});
exports.cPeers = new peers(db);
console.log('Connected to MariaDB');

const updater = async () => {
  utils.VERSIONS = await self.cPeers.allFrom('scan_versions');
  utils.PLATFORMS = await self.cPeers.allFrom('scan_platforms');
  console.log('Versions and Platforms updated to cache!')
}

exports.launch = async () => {
  // Update constants VERSIONS and PLATFORMS
  await updater()
  const updaterInterval = setInterval(()=>{updater()}, 1000*60*config.mariaDB.updateConstants);
}

module.export = db;
