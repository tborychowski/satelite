'use strict';

var OS = require('os');
var FS = require('fs');
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
			d.mountpoint = d.mountpoint.replace(/\,$/, '');	// bug in drivelist adds comma to name

			// TODO: update for Win and OSX

			if (process.platform === 'linux') {
				if (d.mountpoint === '/') d.trashPath = Path.join(homedir, '.local', 'share', 'Trash');
				else d.trashPath = Path.join(d.mountpoint, '.Trash-' + uid);
			}

			return d;
		});
}


function getTrashItemCount (t) {
	return new Promise(function (resolve, reject) {
		FS.readdir(t.trashPath + '/files', function (err, itemCount) {
			if (err) return reject(err);
			t.itemCount = itemCount.length;
			return resolve(t);
		});
	});
}

function getTrashSize (t) {
	return new Promise(function (resolve, reject) {

		// TODO: update for Win and OSX

		exec('du -sB1 ' + t.trashPath, function (err, stdout) {
			if (err) return reject(err);
			t.trashSize = parseInt(('' + stdout).trim().split('\t')[0], 10);
			if (!t.itemCount) t.trashSize = 0;
			return resolve(t);
		});
	});
}


function getSizes (trashes) {
	var sizes = trashes.map(function (t) {
		return getTrashItemCount(t).then(getTrashSize);
	});

	return Promise.all(sizes)
		.then(function (data) {
			var sum = data.reduce(function(pv, cv) { return pv + cv.trashSize; }, 0);
			var items = data.reduce(function(pv, cv) { return pv + cv.itemCount; }, 0);
			sum = sum / 1024 / 1024;
			return { size: Math.round(sum * 100) / 100, items: items };
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
