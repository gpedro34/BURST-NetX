'use strict';

// Get all peers
exports.peers = (req, res) => {
  let firstIndex = req.params.start;
  let amount = req.params.howmany;
  // Get all peers from db
  if(firstIndex && amount){
    if(amount > 250){
      amount = 250;
    }
    // TODO: get peers from DB

  } else {
    amount = 100;
  }

  // Ex. of how should be the object coming out of this function
  res.send({
    peers:[
      {address: 'id'},
      {address: 'id'},
      {address: '...'},
      {address: '100'}
    ]
  })
}

// Get peers by Platform
const peersByPlatform = async (platform) => {
  // TODO: Get peers by platform from DB


  // Ex. of how should be the object coming out of this function
  let obj = {
    platform:{
      addresses:['addresses in here','...','addresses in here']
    }
  }
  return obj;
}
// Get peers by Version
const peersByVersion = async (version) => {
  // TODO: Get peers by version from DB

  // Ex. of how should be the object coming out of this function
  let obj = {
    versions:[
      {
        version:"name",
        addresses:['addresses in here','...','addresses in here']
      }
    ]
  }
  return obj;
}
// Get peers by Height
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
  let obj;
  if(req.body.requestType === 'byPlatform'){
    obj = await peersByPlatform(req.body.platform)
    // Send the results
    res.send(obj);
  } else if(req.body.requestType === 'byVersion'){
    obj = await peersByVersion(req.body.version)
    // Send the results
    res.send(obj);
  } else if(req.body.requestType === 'byHeight'){
    obj = await peersByHeight(req.body.height)
  } else {
    obj.status = 500;
  }
  // Send the results
  res.send(obj);
}
