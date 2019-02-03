'use strict';

const utils = require('./../utils');

class Peers {
  constructor(db) {
		this.db = db;
	}

  // All from table (optional ID to search for)
  async allFrom(table, id) {
    const dbc = await this.db.getConnection();
    let ob = [];
    let query = 'SELECT * from '+table;
    let arr = [];
    try {
      await dbc.beginTransaction();
      let res;
      if(id){
        if(table === 'scans'){
          query += ' WHERE peer_id = ?';
          arr.push(id);
        } else {
          query += ' WHERE id = ?'
          arr.push(id);
        }
      }
      [res] = await dbc.execute(query, arr);
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
  // Peers by ID or Address or list of peers (paginated)
  async peers(id, address, limit, start) {
    const dbc = await this.db.getConnection();
    let query = 'SELECT * FROM peers ';
    let arr = [];
    if (address) {
      query += 'WHERE address = ?'
            + ' ORDER BY id ASC';
      arr.push(address);
    } else if(id){
      query += 'WHERE id = ?'
            + ' ORDER BY id ASC';
      arr.push(id);
    } else if (limit){
      query += 'WHERE id'
            + ' BETWEEN '+start
            + ' AND '+(limit+start-1)
            + ' ORDER BY id ASC';
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
            if(el.id >= start && el.id <= limit+start-1){
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
        if(address){
          ob.push({ error: 'There is no peer with such address' });
        } else if (id){
          ob.push({ error: 'There is no peer with such id' });
        } else {
          ob.push({ error: 'Something went wrong. Report Exception 22 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title=' });
        }
        dbc.release();
        return ob;
      }
    } catch(err){
      if(address){
        ob.push({ error: 'There is no peer with such address' });
      } else if (id){
        ob.push({ error: 'There is no peer with such id' });
      } else {
        ob.push({ error: 'Something went wrong. Report Exception 22 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title=' });
      }
      console.log('Errored');
      console.log(err);
      console.log(ob);
      dbc.release();
      return ob;
    }
  }
  // Get peer scans
  async completePeer(peer) {
    if(peer.id){
      const scan = await this.allFrom('scans', peer.id);
      let ob = {
        address: peer.address,
        id: peer.id,
        discovered: peer.discovered,
        lastSeen: peer.lastSeen,
        lastScanned: peer.lastScanned,
        measurements: []
      }
      await utils.asyncForEach(scan, async (row)=>{
        const version = await this.versions(row.versionId);
        const platform = await this.platforms(row.platformId);
        ob.measurements.push([
          row.timestamp,
          row.result,
          row.rtt,
          row.blockHeight,
          version[0].version,
          platform[0].platform
        ]);
      });
      return ob;
    } else {
      if(peer.error){
        return peer;
      }
    }
  }
  // gets platforms from a given a platform or platformID
  async platforms(id, platform) {
    const dbc = await this.db.getConnection();
    let res;
    await dbc.beginTransaction();
    let query = 'SELECT * from scan_platforms';
    let arr = [];
    if(id){
      query += ' WHERE id = ?'
              +' ORDER BY id ASC'
      arr.push(id);
    } else if(platform) {
      query += ' WHERE platform = ?'
            +' ORDER BY id ASC';
      arr.push(platform);
    }
    try{
      [res] = await dbc.execute(query, arr);
      dbc.release();
      if(res[0]){
        return [{
          id: res[0].id,
          platform: res[0].platform
        }];
      } else {
        if(id){
          return {error: 'There is no platform with that ID'};
        } else if(platform) {
          return {error: 'There is no platform with that Name'};
        } else {
          console.error('Something went wrong. Report Exception 20 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title=');
          return {error: 'Something went wrong. Report Exception 20 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title='}
        }
      }
    }catch(err){
      if(id){
        return {error: 'There is no platform with that ID'};
      } else if(platform) {
        return {error: 'There is no platform with that Name'};
      } else {
        console.error('Something went wrong. Report Exception 20 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title=');
        return {error: 'Something went wrong. Report Exception 20 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title='}
      }
    }
  }
  // gets peers that ever used a certain platformId
  async getPeersByPlatformId(id) {
    let ob = [];
    const dbc = await this.db.getConnection();
    await dbc.beginTransaction();
    const [res] = await dbc.execute(
        'SELECT DISTINCT peer_id from scans'
      +' WHERE platform_id = ?'
      +' ORDER BY peer_id ASC'
    , [id]);
    dbc.release();
    await res.forEach(async (el)=>{
      ob.push({id:el.peer_id});
    })
    return ob;
  }
  // gets versions from a given version or versionId
  async versions(id, version) {
    const dbc = await this.db.getConnection();
    let res;
    await dbc.beginTransaction();
    let query = 'SELECT * from scan_versions';
    let arr = [];
    if(id){
      query +=' WHERE id = ?'
             +' ORDER BY id ASC'
      arr.push(id);
    } else if(version) {
      query += ' WHERE version = ?'
              +' ORDER BY version ASC'
      arr.push(version); // need tests
    }
    try{
      [res] = await dbc.execute(query, arr);
      dbc.release();
      if(res[0]){
        return [{
          id: res[0].id,
          version: res[0].version
        }];
      } else {
        if(id){
          return {error: 'There is no version with that ID'};
        } else if(platform) {
          return {error: 'There is no version with that Name'};
        } else {
          console.error('Something went wrong. Report Exception 21 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title=');
          return {error: 'Something went wrong. Report Exception 21 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title='}
        }
      }
    }catch(err){
      if(id){
        return {error: 'There is no version with that ID'};
      } else if(version) {
        return {error: 'There is no version with that Name'};
      } else {
        console.error('Something went wrong. Report Exception 21 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title=');
        return {error: 'Something went wrong. Report Exception 21 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title='}
      }
    }
  }
  // gets peers that ever used a certain versionId
  async getPeersByVersionId(id) {
    let ob = [];
    const dbc = await this.db.getConnection();
    await dbc.beginTransaction();
    const [res] = await dbc.execute(
          'SELECT DISTINCT peer_id from scans'
        +' WHERE version_id = ?'
        +' ORDER BY peer_id ASC'
    , [id]);
    dbc.release();
    await res.forEach(async (el)=>{
      ob.push({id:el.peer_id});
    })
    return ob;
  }
  // get address of a given peerId
  async completeForCall(id) {
    const dbc = await this.db.getConnection();
    const [resP] = await dbc.execute(
        'SELECT address from peers'
      +' WHERE id = ?'
    , [id]);
    dbc.release();
    return  resP[0].address
  }
  // get peers seen over give height
  async height (height) {
    let ob = [];
    const dbc = await this.db.getConnection();
    await dbc.beginTransaction();
    const [res] = await dbc.execute(
      'SELECT DISTINCT peer_id, block_height from scans'
    +' WHERE (result = 0 AND block_height >= '+height+')'
    +' ORDER BY block_height DESC'
    , []);
    dbc.release();
    await res.forEach(async (el)=>{
      ob.push({id:el.peer_id});
    })
    return ob;
  }
}

module.exports = Peers;
