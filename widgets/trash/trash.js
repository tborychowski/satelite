'use strict';

const OS = require('os');
const FS = require('fs');
const Path = require('path');
const exec = require('child_process').exec;
const drivelist = require('drivelist');
const empty = require('empty-trash');


function get () {
	return new Promise((resolve, reject) => {
		drivelist.list((err, disks) => err ? reject(err) : resolve(disks));
	});
}


function getTrash(disks) {
	var uid = process.getuid(), homedir = OS.homedir();
	return disks
		.filter((d) => !!d.mountpoint)
		.map((d) => {
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
	return new Promise((resolve) => {
		FS.readdir(t.trashPath + '/files', (err, itemCount) => {
			t.itemCount = (err ? 0: itemCount.length);
			return resolve(t);
		});
	});
}

function getTrashSize (t) {
	return new Promise((resolve, reject) => {

		// TODO: update for Win and OSX

		exec('du -sB1 ' + t.trashPath, (err, stdout) => {
			if (err) return reject(err);
			let size = ('' + stdout).trim().split('\t')[0];
			t.trashSize = t.itemCount ? parseInt(size, 10) : 0;
			return resolve(t);
		});
	});
}


function getSizes (trashes) {
	var sizes = trashes.map((t) => getTrashItemCount(t).then(getTrashSize));

	return Promise.all(sizes)
		.then((data) => {
			let sum = data.reduce((pv, cv) =>  pv + cv.trashSize, 0);
			let items = data.reduce((pv, cv) =>  pv + cv.itemCount, 0);
			let size = Math.round(sum / 1024 / 1024 * 100) / 100;
			return { size, items };
		});
}



module.exports = {
	empty,

	get: () => {
		return get()
			.then(getTrash)
			.then(getSizes)
			.catch(console.error.bind(console));
	}

};
