'use strict';

// Util to be able to make forEach's asynchronous
const { asyncForEach } = require('./../utils');

// Dictionaries for brs-crawler information in DB
const BRS_SCAN_RESULT = [
	'Success',
	'Error UNKNOWN',
	'Error TIMEOUT',
	'Error REFUSED',
	'Error REDIRECT'
];
const BRS_BLOCK_REASONS = ['No', 'Illegal Address'];

// Dictionaries for utils-crawler information in DB
const BLOCK_REASONS = {
	NOT_BLOCKED: 0,
	ILLEGAL_ADDRESS: 1,
	NEW_IP: 2
};
const SSL_CODES = {
	VALID: 0,
	INVALID: 1,
	NOT_FOUND: 2,
	IP_MISMATCH: 3,
	EXPIRED: 4
};

// Class construction
class Peers {
	constructor(db) {
		this.db = db;
	}
	// Search from a table
	async allFrom(table, id, prop, order, symbol = '=', show = '*', and = null) {
		const dbc = await this.db.getConnection();
		const ob = [];
		let query = 'SELECT ' + show + ' from ' + table;
		const arr = [];
		try {
			await dbc.beginTransaction();
			if (id) {
				if (table === 'scans') {
					if (!order) {
						order = 'DESC';
					}
					if (!prop) {
						prop = 'peer_id';
					}
					query +=
						' WHERE ' + prop + ' = ?' + ' ORDER BY block_height ' + order;
					arr.push(id);
				} else {
					if (!prop) {
						prop = 'id';
					}
					if (!order) {
						order = 'ASC';
					}
					query += ' WHERE ' + prop + ' ' + symbol + ' ?';
					if (and) {
						query += ' AND ' + and;
					}
					query += ' ORDER BY ' + prop + ' ' + order;
					arr.push(id);
				}
			}
			const [res] = await dbc.execute(query, arr);
			for (let a = 0; a < res.length; a++) {
				if (table === 'scan_platforms') {
					ob.push({
						id: res[a].id,
						platform: res[a].platform
					});
				} else if (table === 'scan_versions') {
					ob.push({
						id: res[a].id,
						version: res[a].version
					});
				} else if (table === 'scans') {
					res[a].result = BRS_SCAN_RESULT[res[a].result];
					ob.push({
						id: res[a].id,
						peerId: res[a].peer_id,
						timestamp: res[a].ts,
						result: res[a].result,
						rtt: res[a].rtt,
						versionId: res[a].version_id,
						platformId: res[a].platform_id,
						peersCount: res[a].peers_count,
						blockHeight: res[a].block_height
					});
				} else if (table === 'peers') {
					res[a].blocked = BRS_BLOCK_REASONS[res[a].blocked];
					ob.push({
						id: res[a].id,
						address: res[a].address,
						blocked: res[a].blocked,
						discovered: res[a].first_seen,
						lastSeen: res[a].last_seen,
						lastScanned: res[a].last_scanned
					});
				} else if (table === 'checks') {
					ob.push({
						id: res[a].id,
						ip: res[a].ip,
						hash: res[a].hash,
						peerId: res[a].peer_id,
						blocked: res[a].blocked,
						locId: res[a].loc_id,
						sslId: res[a].ssl_id,
						api: res[a].api,
						lastScanned: res[a].last_scanned
					});
				} else if (table === 'ssl_checks') {
					res[a].blocked = BRS_BLOCK_REASONS[res[a].blocked];
					switch (res[a].ssl_status) {
						case SSL_CODES.VALID:
							res[a].ssl_status = 'Valid';
							break;
						case SSL_CODES.INVALID:
							res[a].ssl_status = 'Invalid';
							break;
						case SSL_CODES.NOT_FOUND:
							res[a].ssl_status = 'Not found';
							break;
						case SSL_CODES.IP_MISMATCH:
							res[a].ssl_status = 'IP mismatch detected';
							break;
						case SSL_CODES.EXPIRED:
							res[a].ssl_status = 'Expired';
							break;
					}
					ob.push({
						id: res[a].ssl_id,
						ssl: res[a].ssl_status,
						sslFrom: res[a].ssl_from,
						sslTo: res[a].ssl_to,
						hash: res[a].hash
					});
				} else if (table === 'loc_checks') {
					res[a].blocked = BRS_BLOCK_REASONS[res[a].blocked];
					ob.push({
						id: res[a].loc_id,
						country: res[a].country_city.slice(
							0,
							res[a].country_city.indexOf(', ')
						),
						city: res[a].country_city.slice(
							res[a].country_city.indexOf(', ') + 2,
							res[a].country_city.length
						)
					});
				}
			}
			dbc.release();
			return ob;
		} catch (err) {
			console.log('Errored');
			console.log(err);
			return;
		}
	}
	// Peers by ID or Address or list of peers (paginated)
	async peers(id, address, limit, start) {
		const dbc = await this.db.getConnection();
		let query = 'SELECT * FROM peers ';
		const arr = [];
		if (address) {
			query += 'WHERE address = ?' + ' ORDER BY id ASC';
			arr.push(address);
		} else if (id) {
			query += 'WHERE id = ?' + ' ORDER BY id ASC';
			arr.push(id);
		} else if (limit) {
			query += 'WHERE id >= ' + start + ' LIMIT ' + limit;
		}
		const ob = [];
		let res;
		try {
			await dbc.beginTransaction();
			[res] = await dbc.execute(query, arr);
			if (!start) {
				start = 1;
			}
			if (res[0]) {
				if (id || address) {
					ob.push({
						id: res[0].id,
						address: res[0].address,
						blocked: res[0].blocked,
						discovered: res[0].first_seen,
						lastSeen: res[0].last_seen,
						lastScanned: res[0].last_scanned
					});
				} else {
					res.forEach(el => {
						ob.push({
							id: el.id,
							address: el.address,
							blocked: el.blocked,
							discovered: el.first_seen,
							lastSeen: el.last_seen,
							lastScanned: el.last_scanned
						});
					});
				}
			} else {
				if (address) {
					ob.push({ error: 'There is no peer with such address' });
				} else if (id) {
					ob.push({ error: 'There is no peer with such id' });
				} else if (res) {
					ob.push({
						error:
							"The 'start' parameter in your query must be a valid peer ID in our DB"
					});
				} else {
					ob.push({
						error:
							'Something went wrong. Report Exception 26 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title='
					});
				}
			}
			dbc.release();
			return ob;
		} catch (err) {
			if (address) {
				ob.push({ error: 'There is no peer with such address' });
			} else if (id) {
				ob.push({ error: 'There is no peer with such id' });
			} else if (res && !res[0]) {
				ob.push({
					error:
						"The 'start' parameter in your query must be a valid peer ID in our DB"
				});
			} else {
				ob.push({
					error:
						'Something went wrong. Report Exception 25 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title='
				});
			}
			console.log('Errored');
			console.log(err);
			console.log(ob);
			return ob;
		}
	}
	// Get peer scans
	async completePeer(peer, timetable) {
		// load all platforms
		const plat = await this.allFrom('scan_platforms', 0, 'id', null, '>');
		// Load all versions
		const ver = await this.allFrom('scan_versions', 0, 'id', null, '>');
		//
		// Uptime timetable configurations
		let text;
		if (
			!timetable ||
			(timetable.indexOf('-minutes') <= 0 &&
				timetable.indexOf('-hours') <= 0 &&
				timetable.indexOf('-days') <= 0 &&
				timetable.indexOf('-weeks') <= 0 &&
				timetable.indexOf('-months') <= 0)
		) {
			timetable = 1000 * 60 * 60 * 24 * 7;
			text = '7-days';
		} else if (timetable.indexOf('-minutes') > 0) {
			let minutes = Number(timetable.slice(0, timetable.indexOf('-minutes')));
			if (
				typeof minutes !== 'number' ||
				minutes <= 0 ||
				minutes > 365 * 24 * 60
			) {
				minutes = 60;
			}
			timetable = 1000 * 60 * minutes;
			text = minutes + '-minutes';
		} else if (timetable.indexOf('-hours') > 0) {
			let hours = Number(timetable.slice(0, timetable.indexOf('-hours')));
			if (typeof hours !== 'number' || hours <= 0 || hours > 365 * 24) {
				hours = 24;
			}
			timetable = 1000 * 60 * 60 * hours;
			text = hours + '-hours';
		} else if (timetable.indexOf('-days') > 0) {
			let days = Number(timetable.slice(0, timetable.indexOf('-days')));
			if (typeof days !== 'number' || days <= 0 || days > 365) {
				days = 7;
			}
			timetable = 1000 * 60 * 60 * 24 * days;
			text = days + '-days';
		} else if (timetable.indexOf('-weeks') > 0) {
			let weeks = Number(timetable.slice(0, timetable.indexOf('-weeks')));
			if (typeof weeks !== 'number' || weeks <= 0 || weeks > 53) {
				weeks = 4;
			}
			timetable = 1000 * 60 * 60 * 24 * 7 * weeks;
			text = weeks + '-weeks';
		} else if (timetable.indexOf('-months') > 0) {
			let months = Number(timetable.slice(0, timetable.indexOf('-months')));
			if (typeof months !== 'number' || months <= 0 || months > 13) {
				months = 6;
			}
			timetable = 1000 * 60 * 60 * 24 * 30 * months;
			text = months + '-months';
		}

		if (peer.id) {
			// Load uptime scans from the requested peer
			const scan = await this.allFrom('scans', peer.id);
			// Initial proprieties of object to return
			const ob = {
				address: peer.address,
				id: peer.id,
				discovered: peer.discovered,
				lastSeen: peer.lastSeen,
				lastScanned: peer.lastScanned,
				uptimeInterval: text
			};
			// Uptime calculations
			let successCount = 0;
			let totalCount = 0;
			let ts;
			scan.forEach(row => {
				if (Math.abs(new Date(row.timestamp) - new Date()) <= timetable) {
					totalCount++;
					if (row.result === 'Success') {
						successCount++;
					}
					if (!ts || Math.abs(new Date(ts) - new Date(row.timestamp)) < 0) {
						for (let a = 0; a < ver.length; a++) {
							if (ver[a].id === row.versionId) {
								ob.version = ver[a].version;
								a = ver.length;
							}
						}
						for (let b = 0; b < plat.length; b++) {
							if (plat[b].id === row.platformId) {
								ob.platform = plat[b].platform;
								b = plat.length;
							}
						}
						ob.lastHeight = row.blockHeight;
						ts = row.timestamp;
					}
				}
				if (row === scan[scan.length - 1]) {
					if (successCount === 0 || totalCount === 0) {
						ob.uptime = 0;
						ob.version = null;
						ob.platform = null;
						ob.lastHeight = null;
					} else {
						ob.uptime = (successCount / totalCount) * 100;
					}
				}
			});
			return ob;
		} else {
			if (peer.error) {
				return peer;
			}
		}
	}
	// gets platforms from a given a platform or platformID
	async platforms(id, platform) {
		const dbc = await this.db.getConnection();
		let res;
		await dbc.beginTransaction();
		let query = 'SELECT * from scan_platforms';
		const arr = [];
		if (id) {
			query += ' WHERE id = ?' + ' ORDER BY id ASC';
			arr.push(id);
		} else if (platform) {
			query += ' WHERE platform = ?' + ' ORDER BY id ASC';
			arr.push(platform);
		}
		try {
			[res] = await dbc.execute(query, arr);
			dbc.release();
			if (res[0]) {
				return [
					{
						id: res[0].id,
						platform: res[0].platform
					}
				];
			} else {
				if (id) {
					return { error: 'There is no platform with that ID' };
				} else if (platform) {
					return { error: 'There is no platform with that Name' };
				} else {
					console.error(
						'Something went wrong. Report Exception 24 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title='
					);
					return {
						error:
							'Something went wrong. Report Exception 24 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title='
					};
				}
			}
		} catch (err) {
			if (id) {
				return { error: 'There is no platform with that ID' };
			} else if (platform) {
				return { error: 'There is no platform with that Name' };
			} else {
				console.error(
					'Something went wrong. Report Exception 23 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title='
				);
				return {
					error:
						'Something went wrong. Report Exception 23 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title='
				};
			}
		}
	}
	// gets peers that ever used a certain platformId
	async getPeersByPlatformId(id) {
		const ob = [];
		const dbc = await this.db.getConnection();
		await dbc.beginTransaction();
		const [res] = await dbc.execute(
			'SELECT DISTINCT peer_id from scans' +
				' WHERE platform_id = ?' +
				' ORDER BY peer_id ASC',
			[id]
		);
		dbc.release();
		await res.forEach(async el => {
			ob.push({ id: el.peer_id });
		});
		return ob;
	}
	// gets versions from a given version or versionId
	async versions(id, version) {
		const dbc = await this.db.getConnection();
		let res;
		await dbc.beginTransaction();
		let query = 'SELECT * from scan_versions';
		const arr = [];
		if (id) {
			query += ' WHERE id = ?' + ' ORDER BY id ASC';
			arr.push(id);
		} else if (version) {
			query += ' WHERE version = ?' + ' ORDER BY version ASC';
			arr.push(version); // need tests
		}
		try {
			[res] = await dbc.execute(query, arr);
			dbc.release();
			if (res[0]) {
				return [
					{
						id: res[0].id,
						version: res[0].version
					}
				];
			} else {
				if (id) {
					return { error: 'There is no version with that ID' };
				} else if (version) {
					return { error: 'There is no version with that Name' };
				} else {
					console.error(
						'Something went wrong. Report Exception 22 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title='
					);
					return {
						error:
							'Something went wrong. Report Exception 22 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title='
					};
				}
			}
		} catch (err) {
			if (id) {
				return { error: 'There is no version with that ID' };
			} else if (version) {
				return { error: 'There is no version with that Name' };
			} else {
				console.error(
					'Something went wrong. Report Exception 21 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title='
				);
				return {
					error:
						'Something went wrong. Report Exception 21 at https://github.com/gpedro34/BURST-NetX/issues/new?assignees=&labels=&template=bug_report.md&title='
				};
			}
		}
	}
	// gets peers that ever used a certain versionId
	async getPeersByVersionId(id) {
		const ob = [];
		const dbc = await this.db.getConnection();
		await dbc.beginTransaction();
		const [res] = await dbc.execute(
			'SELECT DISTINCT peer_id from scans' +
				' WHERE version_id = ?' +
				' ORDER BY peer_id ASC',
			[id]
		);
		dbc.release();
		await res.forEach(async el => {
			ob.push({ id: el.peer_id });
		});
		return ob;
	}
	// get address of a given peerId
	async completeForCall(id) {
		const dbc = await this.db.getConnection();
		const [resP] = await dbc.execute(
			'SELECT address from peers' + ' WHERE id = ?',
			[id]
		);
		dbc.release();
		return resP[0].address;
	}
	// get peers seen over give height
	async height(height) {
		const ob = [];
		const dbc = await this.db.getConnection();
		await dbc.beginTransaction();
		const [res] = await dbc.execute(
			'SELECT DISTINCT peer_id from scans' +
				' WHERE (result = 0 AND block_height >= ' +
				height +
				')' +
				' ORDER BY block_height DESC',
			[]
		);
		dbc.release();
		await res.forEach(async el => {
			ob.push({ id: el.peer_id });
		});
		return ob;
	}
	// gets info from utils_crawler DB tables
	async getInfo(peer) {
		const info = await this.allFrom('checks', peer.id, 'peer_id');
		const ips = [];
		await asyncForEach(info, async el => {
			const ob = {
				ip: el.ip,
				hash: el.hash,
				lastScanned: el.lastScanned
			};
			if (el.api !== 0) {
				ob.apiPort = el.api;
			} else {
				ob.apiPort = false;
			}
			switch (el.blocked) {
				case BLOCK_REASONS.NOT_BLOCKED:
					ob.blocked = 'Not Blocked';
					break;
				case BLOCK_REASONS.ILLEGAL_ADDRESS:
					ob.blocked = 'Invalid IP';
					break;
				case BLOCK_REASONS.NEW_IP:
					ob.blocked = 'IP expired';
					break;
			}
			const ssl = await this.allFrom('ssl_checks', el.sslId, 'ssl_id');
			ob.ssl = ssl[0].ssl;
			if (ob.ssl === 'Invalid') {
				ob.sslFrom = 'N/A';
				ob.sslTo = 'N/A';
			} else {
				ob.sslFrom = ssl[0].sslFrom;
				ob.sslTo = ssl[0].sslTo;
			}
			const loc = await this.allFrom('loc_checks', info[0].locId, 'loc_id');
			try {
				(ob.country = loc[0].country), (ob.city = loc[0].city), ips.push(ob);
			} catch (err) {
				console.log('ERROR: LOCATION MISSING!!! => ' + info[0].locId);
			}
		});
		return ips;
	}
}

// Export contructed class
module.exports = Peers;
