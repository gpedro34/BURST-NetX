'use strict';

const utils = require('./../utils');

class Peers {

  constructor(db) {
		this.db = db;
	}

  async allFrom(table, id) {
    const dbc = await this.db.getConnection();
    let ob = [];
    try {
      await dbc.beginTransaction();
      let res;
      if(id){
        if(table === 'scans'){
          [res] = await dbc.execute('SELECT * from '+table+' WHERE peer_id = ?', [id]);
        } else {
          [res] = await dbc.execute('SELECT * from '+table+' WHERE id = ?', [id]);
        }
      } else {
        [res] = await dbc.execute('SELECT * from '+table, []);
      }
      for(let a = 0; a < res.length; a++){
        if(table === 'scan_platforms'){
          ob.push({
            id: res[a].id,
            platform: res[a].platform
          });
        } else if (table === 'scan_versions') {
          ob.push({
            id: res[a].id,
            version: res[a].version
          });
        } else if (table === 'scans'){
          ob.push({
            id: res[a].id,
            peerId: res[a].peer_id,
            timestamp: res[a].ts,
            result: res[a].result,
            rtt: res[a].rtt,
            versionId: res[a].version_id,
            platformId: res[a].platform_id,
            peersCount: res[a].peers_count,
            blockHeight: res[a].block_height
          });
        }
      }
    } catch(err){
      console.log('Errored');
      console.log(err);
      return ;
    } finally {
  		dbc.release();
      return ob;
  	}
  }

  async peers(id, address, limit, start) {
    const dbc = await this.db.getConnection();
    let query, arr;
    if(id > 0){
      // id validation
      query = 'SELECT * '
            + 'FROM peers '
            + 'WHERE id = ?';
      arr = [id];
    } else if (typeof address === 'string' && address.length > 20) {
      // address validation
      query = 'SELECT * '
            + 'FROM peers '
            + 'WHERE address = ?';
      arr = [address];
    } else {
      // Limit records validation
      if(typeof limit === 'number'){
        if(limit < 1){
          limit = 10;
        } else if(limit > 50){
          limit = 50;
        }
      } else {
        limit = 25;
      }
      query = 'SELECT * FROM peers ';
      arr = [];
    }
    let ob = [];
  	try {
      await dbc.beginTransaction();
      const [res] = await dbc.execute(query, arr);
      if(!start){
        start = 1;
      }
      for(let a = 1; 0 <= limit+start; a++){
        if(res[a].id >= start-1){
          ob.push({
            id: res[a].id,
            address: res[a].address,
            blocked: res[a].blocked,
            discovered: res[a].first_seen,
            lastSeen: res[a].last_seen,
            lastScanned: res[a].last_scanned
          });
          limit--;
        }
      }
    } catch(err){
      console.log('Errored');
      console.log(err);
      return ;
    } finally {
  		dbc.release();
      return ob;
  	}
  }

  async completePeer(peer) {
    let scan;
    let ob = [];
    if(peer.id){
      scan = await this.allFrom('scans', peer.id);
      ob = {
        address: peer.address,
        id: peer.id,
        discovered: peer.discovered,
        lastSeen: peer.lastSeen,
        lastScanned: peer.lastScanned,
        measurements: []
      }
      scan.forEach((row)=>{
        ob.measurements.push([row.timestamp, row.result, row.rtt, row.blockHeight, utils.getVersion(row.versionId), utils.getPlatform(row.platformId)])
      });
      return ob;
    } else {
      scan = await cPeers.allFrom('scans');
    }
  }

}
module.exports = Peers;
