'use strict';

const db = require('./../db/mariadb');
const utils = require('./../utils');
const ssl = require('./../brs/ssl');
const brs = require('./../brs/calls');
const brsUtils = require('./../brs/utils');
const defaults = require('./../../../config/defaults');

const control = require('./../db/controllers').cPeers;

// Handles the GET request
exports.allFrom = async (req, res) => {
  let table, prop, value, order;
  switch(req.query.from){
    case 'platforms':
    case 'versions':
      table = 'scan_'+req.query.from;
      prop = req.query.where;
      value = req.query.value;
      break;
    case 'scans':
      table = req.query.from;
      prop = req.query.where || 'peer_id';
      value = req.query.value;
      break;
    case 'peers':
      table = req.query.from;
      prop = req.query.where;
      value = req.query.value;
      break;
  }
  if(req.query.order && (req.query.order === 'ASC' || req.query.order === 'DESC')){
    order = req.query.order;
  }
  const resp = await control.allFrom(table, value, prop, order);
  let obj;
  if(req.query.from === 'versions'){
    obj = {
      versions: resp
    }
  } else if(req.query.from === 'platforms'){
    obj = {
      platforms: resp
    }
  } else if(req.query.from === 'peers'){
    if(req.query.completePeers === 'true' && defaults.webserver.searchEngine.completePeers === true){
      obj = {
        peers: []
      }
      // TODO: Make location data be stored in DB and be crawled every X amount of time
      // Current way takes almost 40 seconds in average to get location of each peer

      await utils.asyncForEach(resp, async (el)=>{
        // Complete peer information
        const comp = await control.completePeer(el);
        // Resume Measurements
        const resume = await utils.resumeMeasurements(comp);
        obj.peers.push(resume);
      });
    } else {
      obj = {
        peers: resp
      }
    }
  } else if(req.query.from === 'scans'){
    obj = {
      scans: resp
    }
  } else {

  }
  // Send the results
  res.send(obj);
  return;
}
