'use strict';

const control = require('./../db/controllers').cPeers;
const utils = require('./../utils');
const limitPeers = require('./../../../config/defaults').webserver.limitPeersPerAPIcall;

// Validates information from API request and fires function to get peers from DB
const peers = async (firstIndex, amount) => {
  // Validates firstIndex
  if(typeof firstIndex !== 'number' || firstIndex < 1){
    firstIndex = 1;
  }
  // Validates amount (default 25 peers)
  if(typeof amount === 'number'){
    if(amount > limitPeers){
      amount = limitPeers;
    } else if(amount < 1){
      amount = limitPeers;
    }
  } else {
    amount = limitPeers;
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
    const comp = await control.completePeer(el);
    if(comp.error){
      // Send the error
      res.send(comp);
      return comp;
    }
    // Resume Measurements
    const resume = await utils.resumeMeasurements(comp);
    if(resume.error){
      // Send the error
      res.send(resume);
      return resume;
    }
    ob.peers.push(resume);
    if(ob.peers.length === obj.length){
      // Send the results
      ob.peers.sort((a,b)=>{return a.id-b.id});
      res.send(ob);
      return ob;
    }
  });
}
// Handles the POST request
exports.peersPost = async (req, res) => {
  let obj = {};
  let ob = {
    peers:[]
  };
  if(req.body.requestType){
    switch(req.body.requestType){
      case 'peersByPlatform':
        obj = await peersByPlatform(req.body.id, req.body.platform);
        break;
      case 'peersByVersion':
        obj = await peersByVersion(req.body.id, req.body.version);
        break;
      case 'peersByHeight':
        obj = await peersByHeight(req.body.height);
        break;
      case 'peers':
        obj = await peers(req.body.start, req.body.howMany);
        break;
    }
    if(obj){
      if(obj.error){
        // Send the error already handled
        res.send(obj);
        return;
      }
      if(req.body.requestType !== 'peersByPlatform' && req.body.requestType !== 'peersByVersion' && req.body.requestType !== 'peersByHeight'){
        // for peers APi call
        completeGetPeers(req, res, obj);
      } else {
        // for peersbyPlatform, peersByVersion, peersByHeight API calls
        res.send(obj);
        return;
      }
    } else {
      // Send the error as JSON and log it
      const err = {
        error: 'Something went wrong with DB call - Report Exception 10 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title=',
        params: req.params
      };
      console.error(err);
      res.send(err);
    }
  } else {
    // Send the error as JSON
    res.send({error: 'Not a valid API call'});
  }
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
          req.params.howMany = limitPeers;
        }
        obj.peers = await peers(Number(req.params.start), Number(req.params.howMany));
        break;
    }
    if(obj){
      if(obj.error){
        // Send the error
        res.send(obj);
        return;
      } else if(req.params.requestType !== 'getPeersByPlatform' &&
                req.params.requestType !== 'getPeersByVersion' &&
                req.params.requestType !== 'getPeersByHeight' &&
                req.params.requestType !== 'getPeersByPlatformId' &&
                req.params.requestType !== 'getPeersByVersionId'){
        // for getPeersById
        await completeGetPeers(req, res, obj.peers);
      } else {
        // for peersbyPlatform, peersByVersion, peersByHeight API calls
        res.send(obj);
        return;
      }
    } else {
      // Send the error as JSON and log it
      const err = {
        error: 'Something went wrong with DB call - Report Exception 30 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title=',
        params: req.params
      };
      console.error(err);
      res.send(err);
      return;
    }
  } else {
    // Send the error as JSON
    res.send({error: 'Not a valid API call'});
    return;
  }
}
