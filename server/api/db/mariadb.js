'use strict';

const utils = require('./../utils');
const brs = require('./../lib/calls');

const BLOCK_REASONS = {
	NOT_BLOCKED: 0,
	ILLEGAL_ADDRESS: 1,
	NEW_IP: 2
};
const SSL_CODES = {
  VALID: 0,
  INVALID: 1,
  NOT_FOUND: 2,
  IP_MISMATCH: 3,
  EXPIRED: 4
}

class Peers {
  constructor(db) {
		this.db = db;
	}
  // Search from a table
  async allFrom(table, id, prop, order) {
    const dbc = await this.db.getConnection();
    let ob = [];
    let query = 'SELECT * from '+table;
    let arr = [];
    try {
      await dbc.beginTransaction();
      let res;
      if(id){
        if(!order){
          order = 'DESC';
        }
        if(!prop){
          prop = 'peer_id';
        }
        if(table === 'scans'){
          query += ' WHERE '+prop+' = ?'
                  +' ORDER BY block_height '+order;
          arr.push(id);
        } else {
          if(!prop){
            prop = 'id';
          }
          if(!order){
            order = 'ASC';
          }

          query += ' WHERE '+prop+' = ?'
                +' ORDER BY '+prop+' '+order;
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
          res[a].result = brs.SCAN_RESULT[res[a].result];
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
        } else if (table === 'peers'){
          res[a].blocked = brs.BLOCK_REASONS[res[a].blocked];
          ob.push({
            id: res[a].id,
            address: res[a].address,
            blocked: res[a].blocked,
            discovered: res[a].first_seen,
            lastSeen: res[a].last_seen,
            lastScanned: res[a].last_scanned
          });
        } else if (table === 'checks'){
          ob.push({
            id: res[a].id,
            ip: res[a].ip,
            hash: res[a].hash,
            peerId: res[a].peer_id,
            blocked: res[a].blocked,
            locId: res[a].loc_id,
            sslId: res[a].ssl_id,
            api: res[a].api,
            lastScanned: res[a].last_scanned
          });
        } else if (table === 'ssl_checks'){
          res[a].blocked = brs.BLOCK_REASONS[res[a].blocked];
          switch(res[a].ssl_status){
            case SSL_CODES.VALID:
              res[a].ssl_status = 'Valid';
              break;
            case SSL_CODES.INVALID:
              res[a].ssl_status = 'Invalid';
              break;
            case SSL_CODES.NOT_FOUND:
              res[a].ssl_status = 'Not found';
              break;
            case SSL_CODES.IP_MISMATCH:
              res[a].ssl_status = 'IP mismatch detected';
              break;
            case SSL_CODES.EXPIRED:
              res[a].ssl_status = 'Expired';
              break;
          }
          ob.push({
            id: res[a].ssl_id,
            ssl: res[a].ssl_status,
            sslFrom: res[a].ssl_from,
            sslTo: res[a].ssl_to,
            hash: res[a].hash
          });
        } else if (table === 'loc_checks'){
          res[a].blocked = brs.BLOCK_REASONS[res[a].blocked];
          ob.push({
            id: res[a].loc_id,
            country: res[a].country_city.slice(0, res[a].country_city.indexOf(', ')),
            city: res[a].country_city.slice(res[a].country_city.indexOf(', ')+2, res[a].country_city.length)
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
      query += 'WHERE id >= '+start
            + ' LIMIT '+limit;
    }
    let ob = [];
  	let res;
    try {
      await dbc.beginTransaction();
      [res] = await dbc.execute(query, arr);
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
        } else {
          res.forEach((el)=>{
            ob.push({
              id: el.id,
              address: el.address,
              blocked: el.blocked,
              discovered: el.first_seen,
              lastSeen: el.last_seen,
              lastScanned: el.last_scanned
            });
          });
        }
      } else {
        if(address){
          ob.push({ error: 'There is no peer with such address' });
        } else if (id){
          ob.push({ error: 'There is no peer with such id' });
        } else if(res){
          ob.push({ error: "The 'start' parameter in your query must be a valid peer ID in our DB" });
        } else {
          ob.push({ error: 'Something went wrong. Report Exception 26 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title=' });
        }
      }
    } catch(err){
      if(address){
        ob.push({ error: 'There is no peer with such address' });
      } else if (id){
        ob.push({ error: 'There is no peer with such id' });
      } else if(res && !res[0]){
        ob.push({ error: "The 'start' parameter in your query must be a valid peer ID in our DB" });
      } else {
        ob.push({ error: 'Something went wrong. Report Exception 25 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title=' });
      }
      console.log('Errored');
      console.log(err);
      console.log(ob);
    } finally {
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
        ob.measurements.push({
          timestamp: row.timestamp,
          result: row.result,
          rtt: row.rtt,
          height: row.blockHeight,
          version: version[0].version,
          platform: platform[0].platform
        });
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
          console.error('Something went wrong. Report Exception 24 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title=');
          return {error: 'Something went wrong. Report Exception 24 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title='}
        }
      }
    }catch(err){
      if(id){
        return {error: 'There is no platform with that ID'};
      } else if(platform) {
        return {error: 'There is no platform with that Name'};
      } else {
        console.error('Something went wrong. Report Exception 23 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title=');
        return {error: 'Something went wrong. Report Exception 23 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title='}
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
          console.error('Something went wrong. Report Exception 22 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title=');
          return {error: 'Something went wrong. Report Exception 22 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title='}
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
      'SELECT DISTINCT peer_id from scans'
    +' WHERE (result = 0 AND block_height >= '+height+')'
    +' ORDER BY block_height DESC'
    , []);
    dbc.release();
    await res.forEach(async (el)=>{
      ob.push({id:el.peer_id});
    })
    return ob;
  }
  // gets info from utils_crawler DB tables
  async getInfo (peer){
    const info = await this.allFrom('checks', peer.id, 'peer_id');
    let ips = [];
    await utils.asyncForEach(info, async (el)=>{
      let ob = {
        ip: el.ip,
        hash: el.hash,
        lastScanned: el.lastScanned
      };
      if(el.api !== 0){
        ob.apiPort = el.api;
      } else {
        ob.apiPort = false;
      }
      switch(el.blocked){
        case BLOCK_REASONS.NOT_BLOCKED:
          ob.blocked = "Not Blocked";
          break;
        case BLOCK_REASONS.ILLEGAL_ADDRESS:
          ob.blocked = 'Invalid IP';
          break;
        case BLOCK_REASONS.NEW_IP:
          ob.blocked = 'IP expired';
          break;
      }
      const ssl = await this.allFrom('ssl_checks', el.ssl_id, 'ssl_id');
      ob.ssl = ssl[0].ssl;
      ob.sslFrom = ssl[0].sslFrom;
      ob.sslTo = ssl[0].sslTo;

      const loc = await this.allFrom('loc_checks', info[0].loc_id, 'loc_id');
      ob.country = loc[0].country,
      ob.city = loc[0].city,
      ips.push(ob)
    });
    return ips;
  }
}

module.exports = Peers;
