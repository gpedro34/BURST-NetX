'use strict';

const db = require('./../db/mariadb');
const utils = require('./../utils');
const ssl = require('./../lib/ssl');
const brs = require('./../lib/calls');
const brsUtils = require('./../lib/utils');
const def = require('./../../../config/defaults');

const control = require('./../db/controllers').cPeers;

// Handles the GET request
exports.peerGet = async (req, res) => {
  let obj = {};
  req.params.id = Number(req.params.id)
  // Get Peer basic information
  if(req.params.id > 0){
    obj = await control.peers(req.params.id);
  } else if(typeof req.params.address === 'string' && req.params.address.length > 10){
    obj = await control.peers(null, req.params.address);
  } else {
    obj = {
      "error": "You must specify an 'id' or 'address' in your query"
    }
    // Send the error
    res.json(obj);
    return ;
  }
  if(obj[0].error){
    // Send the results
    res.json(obj[0]);
  } else {
    // Complete peer information
    obj = await control.completePeer(obj[0], req.query.uptimeTimetable);
    // SSL, location and wallet check
    let info;
    try{
      if(!def.webserver.useUtilsCrawler){
        info = await ssl.checkNode(brs.normalizeAPI(obj.address, true));
      } else {
        info = await control.getInfo(obj);
      }
    } catch(err){
      console.log(err);
    } finally {
      obj.info = info;
      // Send the results
      res.json(obj);
    }
  }
}
