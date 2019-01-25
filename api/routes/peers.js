'use strict';

const control = require('./../db/controllers').cPeers;
const utils = require('./../utils');

// Validates information from API request and fires function to get peers from DB
const peers = async (firstIndex, amount) => {
  // Validates firstIndex
  if(typeof firstIndex !== 'number' && firstIndex >= 1){
    return {
      error: 'ID to start from is invalid. IDs start at 1'
    }
  }
  // Validates amount (default 25 peers)
  if(typeof amount === 'number'){
    if(amount > 25){
      amount = 25;
    } else if(amount < 1){
      amount = 25;
    }
  } else {
    amount = 25;
  }
  // get peers from DB
  let peers = await control.peers(null, null, amount, firstIndex);
  return peers;
}

// TODO: Get peers by Platform
const peersByPlatform = async (platform) => {
  // TODO: Get peers by platform from DB
  if(platform){
    // Just this one

  } else {
    // All of them
  }



  // Ex. of how should be the object coming out of this function
  let obj = {
      platform: 'Q2-MariaDB',
      addresses:['addresses in here','...','addresses in here']
  }
  // or :
/*{
    platforms:[
      {
        platform: '',
        addresses:['addresses in here','...','addresses in here']
      },
      ...
      ,{
        platform: '',
        addresses:['addresses in here','...','addresses in here']
      }
    ]
  }*/
  return obj;
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
        obj = await peersByPlatform(req.body.platform);
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
        // Send the results
        res.send(obj);
        return;
      }
      obj.forEach(async (el)=>{
        // Complete peer information
        const comp = await control.completePeer(el);
        // Resume Measurements
        const resume = await utils.resumeMeasurements(comp);
        ob.peers.push(resume);
        if(el === obj[obj.length-1]){
          // Send the results
          res.send(ob);
          return;
        }
      });
    } else {
      ob = {
        error: 'Something went wrong'
      }
      // Send the error as JSON
      res.send(ob);
      return;
    }
  } else {
    ob = {
      error: 'Not a valid API call'
    }
    // Send the error as JSON
    res.send(ob);
    return;
  }

}
