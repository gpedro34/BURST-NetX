'use strict';

const path = require('path');
const rfs = require('rotating-file-stream');
const fs = require('fs');

const self = require('./policy');
const config = require('./../../config/defaults').logger;

// ensure log directory exists
const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Options for rotating write stream
const options = {
	interval: config.interval, // rotates daily
	size: config.size, // Rotates if exceeds 10 Mb
	maxSize: config.maxSize, // Holds up to 100Mb of log files
	maxFiles: config.maxFiles, // Holds up to 30 log files
	path: logDirectory
};
if (config.compress) {
	options.compress = config.compress; // compress rotated files
}

// Handle rotating write stream
exports.accessLogStream = rfs(config.name + '.log', options);
self.accessLogStream.on('error', err => {
	// here are reported blocking errors
	// once this event is emitted, the stream will be closed as well
	console.log('A blocking error occured. Error:');
	console.error(err);
});
self.accessLogStream.on('removed', (filename, number) => {
	// rotation job removed the specified old rotated file
	let res = 'Removed ' + filename + ' to ';
	if (number) {
		res += 'not exceed max log files kept!';
	} else {
		res += 'not exceed max size per log file!';
	}
	console.log(res);
});
self.accessLogStream.on('rotation', () => {
	// rotation job started
	console.log('Initiating logs rotation...');
});
self.accessLogStream.on('rotated', filename => {
	// rotation job completed with success producing given filename
	console.log('Finished rotating the logs!');
});
self.accessLogStream.on('warning', err => {
	// here are reported non blocking errors
	console.log('A non blocking error occured. Error:');
	console.error(err);
});
