'use strict';

const control = require('./../db/controllers').cPeers;
const utils = require('./../utils');
const limitPeers = require('./../../../config/defaults').webserver.limitPeersPerAPIcall;
// Validates information from API request and fires function to get peers from DB
const peers = async (firstIndex, amount) => {
  // Validates firstIndex
  if(typeof firstIndex !== 'number' || firstIndex < 1){
    return {
      error: 'ID to start from is invalid. IDs start at 1'
    }
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
  } else {
    // Search by platform ID
    plat = await control.platforms(Number(id), null);
  }
  if(!plat[0]){
    return plat
  } else {
    let peers;
    peers = await control.getPeersByPlatformId(plat[0].id);
    let completePeers = [];
    await utils.asyncForEach(peers, async (el)=>{
      const completePeer = await control.completeForPlatformCall(el.id);
      completePeers.push({id:el.id, address: completePeer});
    });
    return {
        platform: plat[0].platform,
        id: plat[0].id,
        peers: completePeers
    };
  }
}
// TODO: Get peers by Version
const peersByVersion = async (version) => {
  // TODO: Get peers by version from DB

  // Ex. of how should be the object coming out of this function
  let obj = {
    versions:[
      {
        version:"1.1.1",
        addresses:['addresses in here','...','addresses in here']
      }
    ]
  }
  return obj;
}
// TODO: Get peers by Height
const peersByHeight = async (height) => {
  // TODO: Get peers by height from DB

  // Ex. of how should be the object coming out of this function
  let obj = {
    heights:[
      {
        height:500000,
        addresses:['addresses in here','...','addresses in here']
      }
    ]
  }
  return obj;
}
// Handles the POST request
exports.peersPost = async (req, res) => {
  let obj = {};
  let ob = {
    peers:[]
  };
  if(req.body.requestType){
    switch(req.body.requestType){
      case 'peersbyPlatform':
        obj = await peersByPlatform(req.body.id, req.body.platform);
        break;
      case 'peersbyVersion':
        obj = await peersByVersion(req.body.version);
        break;
      case 'peersbyHeight':
        obj = await peersByHeight(req.body.height);
        break;
      case 'peers':
        obj = await peers(req.body.start, req.body.howMany);
        break;
    }
    if(obj){
      if(obj.error){
        // Send the error
        res.send(obj);
        return;
      }
      if(req.body.requestType !== 'peersbyPlatform' && req.body.requestType !== 'peersbyVersion' && req.body.requestType !== 'peersbyHeight'){
        // for peers APi call
        obj.forEach(async (el)=>{
          // Complete peer information
          const comp = await control.completePeer(el);
          if(comp.error){
            // Send the error
            res.send(comp);
            return;
          }
          // Resume Measurements
          const resume = await utils.resumeMeasurements(comp);
          if(resume.error){
            // Send the error
            res.send(resume);
            return;
          }
          ob.peers.push(resume);
          if(el === obj[obj.length-1]){
            // Send the results
            res.send(ob);
            return;
          }
        });
      } else {
        // for peersbyPlatform, peersByVersion, peersByHeight API calls
        res.send(obj);

      }

    } else {
      console.log('Something went wrong with DB call - Exception 1');
      // Send the error as JSON
      res.send({error: 'Something went wrong'});
      return;
    }
  } else {
    // Send the error as JSON
    res.send({error: 'Not a valid API call'});
    return;
  }

}
