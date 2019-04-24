'use strict';

const db = require('./../db/mariadb');
const utils = require('./../utils');
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
    case 'checks':
      table = req.query.from;
      prop = req.query.where;
      value = req.query.value;
      break;
    case 'locations':
      table = 'loc_checks';
      prop = req.query.where;
      value = req.query.value;
      break;
    case 'ssl':
      table = 'ssl_checks';
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
    if(req.query.completePeers === 'true' && defaults.webserver.searchEngine.completePeers && req.query.APIKey && defaults.webserver.searchEngine.authorizedAPIKeys.indexOf(req.query.APIKey) >= 0){
      obj = {
        peers: []
      }
      await utils.asyncForEach(resp, async (el)=>{
        // Complete peer information
        let comp = await control.completePeer(el);
        // Resume Measurements
        comp.info = await control.getInfo({id: comp.id});
        obj.peers.push(comp);
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
  } else if(req.query.from === 'checks'){
    obj = {
      checks: resp
    }
  } else if(req.query.from === 'locations'){
    obj = {
      locations: resp
    }
  } else if(req.query.from === 'ssl'){
    obj = {
      ssl: resp
    }
  }
  // Send the results
  res.json(obj);
  return;
}
