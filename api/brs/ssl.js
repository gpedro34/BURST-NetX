'use strict';

const sslChecker = require('ssl-checker');
const dns = require('dns');

const self = require('./ssl');
const utils = require('./utils');
const location = require('./location');
const brs = require('./calls');

// Manages checks of public API, domain and ssl
exports.checkNode = async (domain) => {
  let a = await walletAPICheck(domain);
  let res = await domainCheck(domain);
  // Results
  res.isPublicAPI = a.isPublicAPI;
  return res;
}

// Checks if wallet has Public API
const walletAPICheck = async (domain) => {
  let port = utils.getPort(domain);
  if(port === undefined){
    port = 0;
  }
  let ob, res, resSSL, ip;
  domain = utils.withoutPort(domain);
  // Checks if wallet is public
  try{
    resW = await brs.callBRS(domain, brs.BRS_API_REQUESTS.TIME);
    ob = {
      isPublicAPI: true
    }
  } catch(err){
    ob = {
      isPublicAPI: false
    }
  }
  return ob;
}
// Resolve domain and checks SSL
const domainCheck = async (domain) => {
  let port = utils.getPort(domain);
  if(port === undefined){
    port = 0;
  }
  let ob, res, resSSL, resLoc, ip;
  domain = utils.withoutPort(domain);
  // Checks if wallet is public
  try{
    resW = await brs.callBRS(domain, brs.BRS_API_REQUESTS.TIME)
  } catch(err){
    // API is not public
    ob = {
      isPublicAPI: false
    }
  }
  // Resolves domain using DNS
  dns.lookup(domain, async (err, address)=>{
    if(err){
      // Invalid Domain
      ob = {
        ssl: 'Invalid domain: '+domain,
        api: Number(port),
        p2p: Number(brs.BRS_DEFAULT_PEER_PORT)
      };
      return ob;
    }
    domain = address;
  });

  try{
    resSSL = await checkSSL(domain, port);
  } catch(err){
    // Unreachable domain on designated port
    ob = {
      isPublic: false
    };
  } finally {
    try{
      resLoc = await location.locate(domain);
    } catch(err){
      console.log(err)
    }
    if(!resSSL || resSSL.error || resSSL.days_remaining <= 0){
      // Invalid SSL
      ob = {
        ip: domain,
        ssl: 'Invalid',
        api: Number(port),
        p2p: Number(brs.BRS_DEFAULT_PEER_PORT),
        city: resLoc.city,
        country: resLoc.country,
        region: resLoc.region
      };
    } else {
      // Valid SSL
      ob = {
        ip: domain,
        ssl: 'Valid',
        api:  Number(port),
        p2p: Number(brs.BRS_DEFAULT_PEER_PORT),
        city: resLoc.city,
        country: resLoc.country,
        region: resLoc.region
      };
    }
    return ob;
  }

}
// deletes any existing subdomain from URL and returns domain
const subDomainFix = (domain) => {
  let subs;
  for(let a = 0; a < 1; a){
    subs = domain.indexOf('.');
    if(subs >= 0 && domain.indexOf('.', subs+1) >= 0){
      domain = domain.slice(subs+1, domain.length);
    } else {
      a++;
    }
  }
  return domain;
}
// check for SSL Information
const checkSSL = async (url, port) => {
  url = utils.normalizeDomain(url);
  let resSSL = await sslChecker(url, 'GET', Number(port));
  return resSSL;
}
