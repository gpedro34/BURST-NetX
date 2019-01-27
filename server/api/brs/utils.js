'use strict';

const self = require('./utils');


// normalizes domains as ['sub.'['sub.']]'domain.com' for SSL checking (returns No http/https/ports)
exports.normalizeDomain = (peerUrl) => {
  let end = peerUrl.indexOf(':', peerUrl.indexOf('/'));
	if(end < 0){
		end = peerUrl.length;
	}
	if(peerUrl.indexOf('https://') >= 0){
		return peerUrl.slice(8, end);
	} else if(peerUrl.indexOf('http://') >= 0){
		return peerUrl.slice(7, end);
	} else if (peerUrl.indexOf('[') == 0){ //IPv6
    end = peerUrl.indexOf(':', peerUrl.indexOf(']'));
    if(end < 0){
      end = peerUrl.length;
    }
    return peerUrl.slice(0, end)
  } else {
		return peerUrl.slice(0, end);
	}
}

// normalizes peer URL (domain+port) if no port in url set default p2p port (8123)
exports.normalizePeer = (peer) => {
  let port = self.getPort(peer);
  if(port === undefined || port <= 0){
    return self.normalizeDomain(peer)+':'+BRS_DEFAULT_PEER_PORT;
  } else {
    return self.normalizeDomain(peer)+':'+port;
  }
};
// Parses the port from a given domain or IP
exports.getPort = (ip) => {
	if(ip.indexOf(':') > 4 && ip.indexOf(':') < 6){
    let end = ip.indexOf(':', ip.indexOf('/'));
    if(end < 0){
       end = ip.length;
    } else {
			end++;
		}
		return ip.slice(end, ip.length);
  } else if(ip.indexOf(':') >= 6){
		return ip.slice(ip.indexOf(':')+1, ip.length);
	} else {
		return undefined;
	}
}
// removes port from a given domain or IP
exports.withoutPort = (ip) => {
	let end = ip.indexOf(':');
	if(end > 0){
		ip = ip.slice(0, end);
	}
	return ip;
}
