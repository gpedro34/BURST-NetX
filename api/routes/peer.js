'use strict';
const db = require('./../db/mariadb');
const utils = require('./../utils');

const control = require('./../db/controllers').cPeers;

// Get peer by ID
const peerById = async (id) => {
  // Get peer by ID from DB
  let peer = await control.peers(id)
  console.log(peer);
  return peer;
}
// Get peer by Address
const peerByAddress = async (address) => {
  // Get peer by address from DB
  let peer = await control.peers(null, address)
  return peer;
}
// Handles the POST request
exports.peerPost = async (req, res) => {
  let obj = {};
  // Get Peer basic information
  if(typeof req.body.id === 'number' && req.body.id > 0){
    obj = await control.peers(req.body.id);
  } else if(typeof req.body.address === 'string' && req.body.address.length > 10){
    obj = await control.peers(null, req.body.address);
  } else {
    obj = {
      error: 'Invalid Peer ID or Address'
    }
    // Send the results
    res.send(obj);
    return;
  }
  if(obj.error){
    // Send the results
    res.send(obj);
    return;
  }
  // Complete peer information
  const comp = await control.completePeer(obj[0]);
  // Resume Measurements
  const resume = await utils.resumeMeasurements(comp);
  // console.log(resume);
  // Send the results
  res.send(resume);
}
