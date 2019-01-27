'use strict';

const db = require('./../db/mariadb');
const utils = require('./../utils');
const ssl = require('./../brs/ssl');
const brs = require('./../brs/calls');

const control = require('./../db/controllers').cPeers;

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
  // SSL, location and wallet check
  const walletData = await ssl.checkNode(brs.normalizeAPI(resume.address, true));
  resume.info = walletData;
  // Send the results
  res.send(resume);
}
