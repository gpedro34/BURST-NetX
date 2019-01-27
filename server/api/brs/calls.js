'use strict';

const request = require('request-promise-native');

const def = require('./../../../config/defaults');
const self = require('./calls');

exports.BRS_DEFAULT_PEER_PORT = def.brs.peerPort;
exports.BRS_DEFAULT_API_PORT = def.brs.apiPort;
const BRS_PROTOCOL = 'B1';

const BRS_USER_AGENT = def.brs.userAgent;
const BRS_TIMEOUT = def.brs.timeout;

exports.BRS_REQUESTS = {
	INFO: 'getInfo',
	PEERS: 'getPeers',
};
exports.BRS_API_REQUESTS = {
	TIME: 'getTime',
};

// if no port or equal to 8123 then port equal to 8125,otherwise keep it
// and add '/burst?requestType=' API point if check is not true
exports.normalizeAPI = (peer, check) => {
	if (peer.indexOf(':', peer.indexOf(']')) < 0 || peer.indexOf(':', peer.indexOf('/')) < 0) {
		return peer+':'+self.BRS_DEFAULT_API_PORT + '/burst?requestType=';
	} else if(peer.slice(peer.indexOf(':', peer.indexOf('/'))+1) == self.BRS_DEFAULT_PEER_PORT){
    peer = peer.slice(0, peer.indexOf(':', peer.indexOf('/'))) + ':' + self.BRS_DEFAULT_API_PORT;
		if(!check){
			return peer+'/burst?requestType=';
		} else {
			return peer;
		}
	} else {
		if(!check){
    	return peer+'/burst?requestType=';
		} else {
			return peer;
		}
  }
}

// Does both P2P and API requests
exports.callBRS = async (peerUrl, requestType) => {
	let method = 'POST';
  peerUrl = 'http://'+peerUrl;
	let headers = {
		'User-Agent': BRS_USER_AGENT
	};
	let body = {
		'protocol': BRS_PROTOCOL,
		'requestType': requestType,
	};
  Object.keys(self.BRS_API_REQUESTS).forEach(function(key) {
    if(self.BRS_API_REQUESTS[key] === requestType){
      peerUrl = self.normalizeAPI(peerUrl)+requestType;
  		method = 'GET';
  		body = {};
    }
  });
	return request({
		method: method,
		url: peerUrl,
		timeout: BRS_TIMEOUT,
		headers: headers,
		json: true,
		body: body,
		time: true,
	});
};
