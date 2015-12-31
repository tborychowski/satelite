'use strict';

var OS = require('os');
var Path = require('path');
var exec = require('child_process').exec;
var drivelist = require('drivelist');
var emptyTrash = require('empty-trash');

function get () {
	return new Promise(function (resolve, reject) {
		drivelist.list(function(err, disks) {
			if (err) return reject(err);
			resolve(disks);
		});
	});
}


function getTrash(disks) {
	var uid = process.getuid(), homedir = OS.homedir();
	return disks
		.filter(function (d) { return !!d.mountpoint; })
		.map(function (d) {
			d = d.mountpoint.replace(/\,$/, '');	// bug in drivelist adds comma to name

			// TODO: update for Win and OSX

			if (d === '/') return Path.join(homedir, '.local', 'share', 'Trash');
			return Path.join(d, '.Trash-' + uid);
		});
}

function getTrashSize (t) {
	return new Promise(function (resolve, reject) {

		// TODO: update for Win and OSX
		// maybe count items (for unix too)

		exec('du -sB1 ' + t, function (err, stdout) {
			if (err) return reject(err);
			return resolve(parseInt(('' + stdout).trim().split('\t')[0], 10));
		});
	});
}


function getSizes (trashes) {
	var sizes = trashes.map(getTrashSize);
	return Promise.all(sizes)
		.then(function (data) {
			var sum = data.reduce(function(pv, cv) { return pv + cv; }, 0);
			sum = sum / 1024 / 1024;
			sum = Math.round(sum * 100) / 100;
			if (sum < 0.28) return 0;
			return sum + ' MB';
		});
}



module.exports = {
	get: function () {
		return get()
			.then(getTrash)
			.then(getSizes)
			.catch(console.error.bind(console));
	},

	empty: emptyTrash
};
