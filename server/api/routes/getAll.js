'use strict';

const utils = require('./../utils');
const defaults = require('./../../../config/defaults');

const control = require('./../db/controllers').cPeers;

const verifyQuery = req => {
	switch (req.query.from) {
		case 'scans':
			req.query.where = req.query.where || 'peer_id';
			break;
		case 'locations':
			req.query.from = 'loc_checks';
			break;
		case 'ssl':
			req.query.from = 'ssl_checks';
			break;
		case 'platforms':
		case 'versions':
			req.query.from = 'scan_' + req.query.from;
			break;
	}
	if (
		req.query.order &&
		req.query.order != 'ASC' &&
		req.query.order != 'DESC'
	) {
		req.query.order = 'ASC';
	}
	return req;
};

const verifyResponse = async (req, resp) => {
	let obj;
	if (req.query.from === 'versions') {
		obj = {
			versions: resp
		};
	} else if (req.query.from === 'platforms') {
		obj = {
			platforms: resp
		};
	} else if (req.query.from === 'peers') {
		if (
			req.query.completePeers === 'true' &&
			defaults.webserver.searchEngine.completePeers &&
			req.query.APIKey &&
			defaults.webserver.searchEngine.authorizedAPIKeys.indexOf(
				req.query.APIKey
			) >= 0
		) {
			obj = {
				peers: []
			};
			await utils.asyncForEach(resp, async el => {
				// Complete peer information
				const comp = await control.completePeer(el);
				// Resume Measurements
				comp.info = await control.getInfo({ id: comp.id });
				obj.peers.push(comp);
			});
		} else {
			obj = {
				peers: resp
			};
		}
	} else if (req.query.from === 'scans') {
		obj = {
			scans: resp
		};
	} else if (req.query.from === 'checks') {
		obj = {
			checks: resp
		};
	} else if (req.query.from === 'locations') {
		obj = {
			locations: resp
		};
	} else if (req.query.from === 'ssl') {
		obj = {
			ssl: resp
		};
	}
	return obj;
};

// Handles the GET request
exports.allFrom = async (req, res) => {
	req = verifyQuery(req);
	const resp = await control.allFrom(
		req.query.from,
		req.query.value,
		req.query.where,
		req.query.order
	);
	const obj = await verifyResponse(req, resp);
	// Send the results
	res.json(obj);
	return;
};
