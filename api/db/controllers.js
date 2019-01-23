const peers = require('./mariadb');
const config = require('./../../config/defaults');
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
const cPeers = new peers(db);

const updater = async () => {
  utils.VERSIONS = await cPeers.allFrom('scan_versions');
  utils.PLATFORMS = await cPeers.allFrom('scan_platforms');
}

exports.launch = async (id, address, limit, start) => {
  // Update constants VERSIONS and PLATFORMS
  await updater()
  const updaterInterval = setInterval(()=>{updater()}, 1000*60*config.mariaDB.updateConstants);
  // Get peer(s) basic info by ID or address with limit results per page
  const peer = await cPeers.peers(id, address, limit, start);
  let ob = [];
  peer.forEach(async (el)=>{
    // Complete peer information
    const comp = await cPeers.completePeer(el);
    // Resume Measurements
    const resume = await utils.resumeMeasurements(comp);
    ob.push(resume);
    if(el === peer[peer.length-1]){
      console.log('Complete query');
      console.log(ob);
    }
  });
}
