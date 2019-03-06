'use strict';

const sslChecker = require('ssl-checker');

const dns = require('./dns').dnsPromise;
const utils = require('./utils');
const location = require('./location');
const brs = require('./calls');

const SSL_CODES = {
  VALID: 0,
  INVALID: 1,
  NOT_FOUND: 2,
  IP_MISMATCH: 3,
  EXPIRED: 4
}

// Manages checks of public API, domain and ssl
exports.checkNode = async (domain) => {
  const res = await domainCheck(domain);
  // Results
  return res;
}
// Checks if wallet has Public API
const walletAPICheck = async (domain) => {
  let port = utils.getPort(domain);
  if(port === undefined){
    port = 0;
  }
  let api;
  domain = utils.withoutPort(domain);
  // Checks if wallet is public
  try{
    let resW = await brs.callBRS(domain, brs.BRS_API_REQUESTS.TIME);
    if(port === 0 || port === undefined){
      api = false;
    } else {
      api = Number(port);
    }
  } catch(err){
    api = false
  }
  return api;
}
// Resolve domain and checks SSL
const domainCheck = async (domain) => {
  let port = utils.getPort(domain);
  let isPublicAPI = true;
  if(port === undefined){
    port = 0;
  }
  let ob = {};
  // Checks if wallet is public
  try{
    ob.apiPort = await walletAPICheck(domain);
  } catch(err){
    ob.apiPort = false;
  }

  // Resolves domain using DNS
  ob.ip = await Promise.all([dns(utils.withoutPort(domain))]);
  ob.ip = ob.ip[0];
  // Tests SSL
  const resSSL = await checkSSL("https://"+domain);
  switch(resSSL.status){
    case SSL_CODES.EXPIRED:
      ob.ssl = 'Expired';
      ob.expiredSince = resSSL.expiredSince;
      break;
    case SSL_CODES.IP_MISMATCH:
      ob.ssl = 'Certificate with IP mismatches';
      ob.sslFrom = resSSL.certFrom;
      ob.sslTo = resSSL.certTo;
      break;
    case SSL_CODES.VALID:
      ob.ssl = 'Valid';
      ob.sslFrom = resSSL.validFrom;
      ob.sslTo = resSSL.validTo;
      break;
    case SSL_CODES.INVALID:
      ob.ssl = 'Invalid';
      ob.sslFrom = null;
      ob.sslTo = null;
      break;
    case SSL_CODES.NOT_FOUND:
      ob.ssl = 'Not Found';
      ob.sslFrom = null;
      ob.sslTo = null;
      break;
  }
  // Locate IP
  try{
    const resLoc = await location.locate(ob.ip);
    ob.city = resLoc.city;
    ob.country = resLoc.country;
    ob.region = resLoc.region;
  } catch(err){
    console.log('Errored trying to locate IP: '+ob.ip);
    console.log(err)
    ob.city = null;
    ob.country = null;
    ob.region = null;
  }
  return ob;
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
const checkSSL = async (url,  port=443) => {
  url = utils.normalizeDomain(url);
  let ob;
  try{
    const resSSL = await sslChecker(url, 'GET', port);
    if(resSSL.valid === false){
      if(resSSL.days_remaining <= 0){
        ob = {
          status: SSL_CODES.EXPIRED,
          domain: url,
          expiredSince: resSSL.valid_to,
          expiredDays: resSSL.days_remaining
        };
      } else {
        ob = {
          status: SSL_CODES.IP_MISMATCH,
          domain: url,
          certFrom: resSSL.valid_from,
          certTo: resSSL.valid_to,
          daysRemaining: resSSL.days_remaining
        };
      }
    } else {
      // Valid SSL
      ob = {
        status: SSL_CODES.VALID,
        domain: url,
        validFrom: resSSL.valid_from,
        validTo: resSSL.valid_to,
        daysRemaining: resSSL.days_remaining
      };
    }
  } catch (err) {
    if(err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET'){
        // Host not found
        ob = {
          status: SSL_CODES.NOT_FOUND,
          domain: url
        };
    } else {
      // Invalid SSL
      ob = {
        status: SSL_CODES.INVALID,
        domain: url
      };
    }
  }
  return ob;
}
