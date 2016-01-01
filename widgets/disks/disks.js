'use strict';

const drivelist = require('drivelist');
const diskspace = require('diskspace');


function formatSize(size) {
	var sizes = size.replace(/^(\d+\.?\d*)\s?([A-Z]{1,2})$/, '$1 $2').split(' ');
	return sizes[0] + ' ' + (sizes[1] + 'B').substr(0, 2);
}


function get () {
	return new Promise((resolve, reject) => {
		drivelist.list((err, disks) => err ? reject(err) : resolve(disks));
	});
}


function format(disks) {
	return disks
		.filter((d) => !!d.mountpoint)
		.map((d) => {
			d.size = formatSize(d.size);
			d.mountpoint = d.mountpoint.replace(/\,$/, '');	// bug in drivelist adds comma to name
			return d;
		});
}


function getDiskSpace (disk) {
	return new Promise ((resolve, reject) => {
		diskspace.check(disk.mountpoint, (err, total, free, status) => {
			if (err) return reject(err);
			disk.total = total;
			disk.free = free;
			disk.used = total - free;
			disk.usedPercent = disk.used / total * 100;
			disk.status = status;
			resolve(disk);
		});
	});
}

function getSpaces (disks) {
	var spaces = disks.map(getDiskSpace);
	return Promise.all(spaces);
}


module.exports = {
	get: () => {
		return get()
			.then(format)
			.then(getSpaces)
			.catch(console.error.bind(console));
	}
};
