'use strict';

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
      return;
    } finally {
  		dbc.release();
      return ob;
  	}
  }

  async peers(id, address, limit, start) {
    const dbc = await this.db.getConnection();
    let query = 'SELECT * FROM peers ';
    let arr = [];
    if (address) {
      query += 'WHERE address = ?';
      arr.push(address);
    } else if(id){
      query += 'WHERE id = ?';
      arr.push(id);
    } else if (limit){
      query += 'WHERE id BETWEEN '+start+' AND '+(limit+start-1);
    }
    let ob = [];
  	try {
      await dbc.beginTransaction();
      const [res] = await dbc.execute(query, arr);
      if(!start){
        start = 1;
      }
      if(res[0]){
        if(id || address){
          ob.push({
            id: res[0].id,
            address: res[0].address,
            blocked: res[0].blocked,
            discovered: res[0].first_seen,
            lastSeen: res[0].last_seen,
            lastScanned: res[0].last_scanned
          });
          dbc.release();
          return ob;
        } else {
          res.forEach((el)=>{
            if(el.id >= start && el.id <= limit+start){
              ob.push({
                id: el.id,
                address: el.address,
                blocked: el.blocked,
                discovered: el.first_seen,
                lastSeen: el.last_seen,
                lastScanned: el.last_scanned
              });
            }
          });
          dbc.release();
          return ob;
        }
      } else {
        ob.push({
          error: 'There is no peer with such address or ID'
        });
        dbc.release();
        return ob;
      }
    } catch(err){
      console.log('Errored');
      console.log(err);
      dbc.release();
      return;
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
        ob.measurements.push([row.timestamp, row.result, row.rtt, row.blockHeight, require('./../utils').getVersion(row.versionId), require('./../utils').getPlatform(row.platformId)])
      });
      return ob;
    } else {
      if(peer.error){
        return peer;
      }
      scan = await this.allFrom('scans');
    }
  }

  async platforms(id, platform){
    const dbc = await this.db.getConnection();
    let res;
    await dbc.beginTransaction();
    try{
      if(id){
        [res] = await dbc.execute('SELECT * from scan_platforms WHERE id = ?', [id]);
      } else if(platform) {
        [res] = await dbc.execute('SELECT * from scan_platforms WHERE platform = ?', [platform]); // need tests
      }
      dbc.release();
      if(res[0]){
        return [{
          id: res[0].id,
          platform: res[0].platform
        }];
      } else {
        return {error: 'There is no platform with that Name/ID'}
      }
    }catch(err){
      console.log(err);
      return {error: 'There is no platform with that Name/ID'}
    }
  }

  async getPeersByPlatformId(id){
    let ob = [];
    const dbc = await this.db.getConnection();
    await dbc.beginTransaction();
    const [res] = await dbc.execute('SELECT DISTINCT peer_id from scans WHERE platform_id = ?', [id]);
    dbc.release();
    await res.forEach(async (el)=>{
      ob.push({id:el.peer_id});
    })
    return ob;
  }

  async completeForPlatformCall(id){
    const dbc = await this.db.getConnection();
    const [resP] = await dbc.execute('SELECT address from peers WHERE id = ?', [id]);
    dbc.release();
    return  resP[0].address
  }

}

module.exports = Peers;
