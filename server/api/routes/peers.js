'use strict';

const control = require('./../db/controllers').cPeers;
const utils = require('./../utils');
const def = require('./../../../config/defaults');

// Validates information from API request and fires function to get peers from DB
const peers = async (firstIndex, amount) => {
  // Validates firstIndex
  if(typeof firstIndex !== 'number' || firstIndex < 1){
    firstIndex = 1;
  }
  // Validates amount (default 10 peers)
  if(typeof amount === 'number'){
    if(amount > def.webserver.limitPeersPerAPIcall){
      amount = def.webserver.limitPeersPerAPIcall;
    } else if(amount < 1){
      amount = def.webserver.limitPeersPerAPIcall;
    }
  } else {
    amount = def.webserver.limitPeersPerAPIcall;
  }
  // get peers from DB
  let peers = await control.peers(null, null, amount, firstIndex);
  return peers;
}
// Get peers by Platform
const peersByPlatform = async (id, platform) => {
  // Gets platform from DB
  let plat;
  if(platform){
    // Search by platform
    plat = await control.platforms(null, platform);
  } else if (id){
    // Search by platform ID
    plat = await control.platforms(Number(id), null);
  }
  if(typeof plat !== 'undefined' && plat) {
    let peers;
    try{
      peers = await control.getPeersByPlatformId(plat[0].id);
      let completePeers = [];
      await utils.asyncForEach(peers, async (el)=>{
        const completePeer = await control.completeForCall(el.id);
        completePeers.push({id:el.id, address: completePeer});
      });
      completePeers.sort((a,b)=>{return a.id-b.id});
      return {
          platform: plat[0].platform,
          id: plat[0].id,
          peers: completePeers
      };
    } catch (err) {
      return {'error': 'There is no such platform'};
    }
  } else {
    // No such version in DB
    return plat;
  }
}
// Get peers by Version
const peersByVersion = async (id, version) => {
  // Gets version from DB
  let ver;
  if(version){
    // Search by version
    ver = await control.versions(null, version);
  } else {
    // Search by version ID
    ver = await control.versions(Number(id), null);
  }
  if(typeof ver !== 'undefined' && ver) {
    let peers;
    try{
      peers = await control.getPeersByVersionId(ver[0].id);
      let completePeers = [];
      await utils.asyncForEach(peers, async (el)=>{
        const completePeer = await control.completeForCall(el.id);
        completePeers.push({id:el.id, address: completePeer});
      });
      completePeers.sort((a,b)=>{return a.id-b.id});
      return {
          version: ver[0].version,
          id: ver[0].id,
          peers: completePeers
      };
    } catch (err) {
      return {'error': 'There is no such version'};
    }
  } else {
    // No such version in DB
    return ver
  }
}
// Get peers by Height
const peersByHeight = async (height) => {
  // Get peers over height from DB
  // Gets peers over height from DB
  const h = await control.height(height);
  if(!h[0]){
    // No peers over designated height in DB
    return h
  } else {
    let completePeers = [];
    await utils.asyncForEach(h, async (el)=>{
      const completePeer = await control.completeForCall(el.id);
      completePeers.push({id:el.id, address: completePeer});
    });
    completePeers.sort((a,b)=>{return a.id-b.id});
    return {
        overHeight: height,
        peers: completePeers
    };
  }
}
// Completes all peers provided in the obj
const completeGetPeers = (req, res, obj)=>{
  // for peers APi call
  let ob = { peers:[] }
  obj.forEach(async (el) => {
    // Complete peer information
    const comp = await control.completePeer(el, req.query.uptimeTimetable);
    if(comp.error){
      // Send the error
      res.json(comp);
      return comp;
    }
    comp.info = await control.getInfo({id: comp.id});
    ob.peers.push(comp);
    if(ob.peers.length === obj.length){
      // Send the results
      ob.peers.sort((a,b)=>{return a.id-b.id});
      res.json(ob);
      return ob;
    }
  });
}

// Handles the GET requests
exports.peersGet = async (req, res) => {
  if(!req.params.requestType){
    req.params.requestType = req.route.path.slice(
      req.route.path.indexOf('get'),
      req.route.path.indexOf('/', req.route.path.indexOf('get')
    ));
  }
  let obj = {};
  if(req.params.requestType){
    switch(req.params.requestType){
      case 'getPeersByPlatform':
        obj = await peersByPlatform(null, req.params.platform);
        break;
      case 'getPeersByPlatformId':
        req.params.id = Number(req.params.id)
        if(isNaN(req.params.id) || req.params.id <= 0){
          obj = {"error": "Please enter a valid platform ID"};
        } else {
          obj = await peersByPlatform(req.params.id, null);
        }
        break;
      case 'getPeersByVersion':
        obj = await peersByVersion(null, req.params.version);
        break;
      case 'getPeersByVersionId':
        req.params.id = Number(req.params.id)
        if(isNaN(req.params.id)){
          obj = {"error": "Please enter a valid version ID"};
        } else {
          obj = await peersByVersion(req.params.id, null);
        }
        break;
      case 'getPeersByHeight':
        obj = await peersByHeight(Number(req.params.height));
        if(!obj.overHeight){
          obj = {"error": "We are yet to see a peer over height "+req.params.height}
        }
        break;
      case 'getPeersById':
        if(!req.params.howMany){
          req.params.howMany = def.webserver.limitPeersPerAPIcall;
        }
        obj.peers = await peers(Number(req.params.start), Number(req.params.howMany));
        break;
    }
    if(obj){
      if(obj.error){
        // Send the error
        res.json(obj);
        return;
      } else if(req.params.requestType === 'getPeersById' && default.webserver.searchEngine.completePeers){
        if(process.env.authorizedAPIKeys.indexOf(req.params.apiKey) >= 0 || default.webserver.searchEngine.authorizedAPIKeys.indexOf(req.params.apiKey) >= 0){
          obj = await completeGetPeers(req, res, obj.peers);
          res.json(obj);
          return;
        }
      } else {
        // for peersbyPlatform, peersByVersion, peersByHeight API calls
        res.json(obj);
        return;
      }
    } else {
      // Send the error as JSON and log it
      const err.error: 'Something went wrong with DB call - Report Exception 30 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title=';
      res.json(err);
      err.req = req;
      console.error(err);
      return;
    }
  } else {
    // Send the error as JSON
    res.json({error: 'Not a valid API call'});
    err.req = req;
    console.error(err);
    return;
  }
}
