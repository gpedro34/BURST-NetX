'use strict';

const fs = require('fs');

const config = require('./../../config/defaults');

// util to read DB password locally stored (optional)
exports.readFileTrim = (file) => {
	if (fs.existsSync(file)) {
		return fs.readFileSync(file,'utf8').trim();
	}
	return null;
};

// Helper method for making forEach's ASYNC
exports.asyncForEach = async (array, callback) => {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}
