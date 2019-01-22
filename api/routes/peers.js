'use strict';

// Get all peers
const peers = async (firstIndex, amount) => {
  // Get all peers from db
  if(firstIndex && amount){
    if(amount > 250){
      amount = 250;
    }
  } else {
    amount = 100;
    firstIndex = 0;
  }
  // TODO: get peers from DB

  // Ex. of how should be the object coming out of this function
  const obj = {
    peers:[
      {address: firstIndex},
      {address: 'id'},
      {address: '...'},
      {address: firstIndex+amount}
    ]
  }
  return obj;
}

// Get peers by Platform
const peersByPlatform = async (platform) => {
  // TODO: Get peers by platform from DB
  if(platform){
    // Just this one

  } else {
    // All of them
  }



  // Ex. of how should be the object coming out of this function
  let obj = {
    platform:{
      addresses:['addresses in here','...','addresses in here']
    }
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
exports.peersPost = async (req, res, next) => {
  let obj = {};
  if(req.body.requestType === 'peersbyPlatform'){
    obj = await peersByPlatform(req.body.platform);
  } else if(req.body.requestType === 'peersbyVersion'){
    obj = await peersByVersion(req.body.version);
  } else if(req.body.requestType === 'peersbyHeight'){
    obj = await peersByHeight(req.body.height);
  } else if(req.body.requestType === 'peers'){
    obj = await peers(req.body.start, req.body.howMany);
  } else {
    const error = new Error('Not a valid API call');
    error.status = 404;
    error.message = 'Not a valid API call';
    next(error);
  }
  // Send the results
  res.send(obj);
}
