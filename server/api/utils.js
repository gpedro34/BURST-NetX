'use strict';

// util to read DB password locally stored (optional)
const fs = require('fs');
exports.readFileTrim = (file) => {
	if (fs.existsSync(file)) {
		return fs.readFileSync(file,'utf8').trim();
	}
	return null;
};

const config = require('./../../config/defaults');
const cPeers = require('./db/controllers').cPeers;
const self = require('./utils');

// Versions Indexer
exports.VERSIONS;
// Platforms Indexer
exports.PLATFORMS;

// Resolve Version ID
exports.getVersion = (id) => {
  let v
  self.VERSIONS.forEach((vers)=>{
    if(vers.id === id){
      v = vers.version;
    }
  });
	if(!v){
		v = '';
	}
  return v;
}
// Resolve Platform ID
exports.getPlatform = (id) => {
  let pl;
  self.PLATFORMS.forEach((platf)=>{
    if(platf.id === id){
      pl = platf.platform;
    }
  });
	if(!pl){
		pl = '';
	}
  return pl;
}
// Resume scan measurements
exports.resumeMeasurements = async (ob) => {
	const arr = ob.measurements;
	let failCount = 0;
	let totalCount = 0;
	let avgRtt = 0;
	let avgCheck = 0;
	let uptime = 0;
	let lastRec, state;
	if(arr){
		arr.forEach((el)=>{
			if(el[1] !== 0){
				failCount++;
				if(el[1] === 1){
					state = 'Unknown error';
				} else if(el[1] === 2){
					state = 'Timed out';
				} else if(el[1] === 3){
					state = 'Refused';
				} else if(el[1] === 4){
					state = 'Wallet is redirecting P2P port traffic';
				}
			} else {
				state = 'Online and synced';
			}
			avgRtt += Number(el[2]);
			if(!lastRec){
				lastRec = el;
				totalCount++;
			} else {
				totalCount++;
				avgCheck += Math.abs(new Date(el[0]) - new Date(lastRec[0]))/1000/60;
				lastRec = el;
			}
			if (el === arr[arr.length-1]){
				avgRtt = Math.floor(avgRtt / totalCount * 100) / 100;
				avgCheck = Math.floor(avgCheck / totalCount * 100) / 100;
				uptime = Math.floor((totalCount-failCount)/totalCount * 100 * 100) / 100;
				if(typeof el[3] !== 'number'){
					el[3] = 0;
				}
				ob.measurements = {
					averageRtt: avgRtt, 					// in miliseconds
					averageCheck: avgCheck,				// in minutes
					timesChecked: totalCount,			// integer
					uptime: uptime,								// percentage without '%'
					height: el[3],								// current height
					version: el[4],								// current version
					platform: el[5],							// current platform
					state: state									// current state
				}
			}
		})
	} else {
		ob = {error: 'Invalid ID or address'};
	}
	return ob;
}
