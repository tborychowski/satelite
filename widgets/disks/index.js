'use strict';

const disks = require('./disks');

function getItemHtml(item) {
	item.icon = item.system ? 'ion-filing' : 'ion-usb';

	return '<li><a class="link" href="' + item.mountpoint + '" title="' + item.description + '">' +
			'<i class="' + item.icon + '"></i>' +
			'<span class="size">' + item.size + '</span>' +
			'<span class="name">' + item.mountpoint + '</span>' +
			'<div class="sizebar">' +
				'<div class="sizebar-inner" style="width:' + item.usedPercent + '%;"></div>' +
			'</div>' +
		'</a></li>';
}



class Widget {
	constructor (el, params, config) {
		this.el = el;
		this.size = params.size;
		this.config = config;
		this.render();
	}

	render (data) {
		let newHtml = '<ul>' + (data || []).map(getItemHtml).join('') + '</ul>';
		if (this.oldHtml !== newHtml) this.el.innerHTML = this.oldHtml = newHtml;
	}

	tick () {
		disks.get().then(this.render.bind(this));
	}
}

module.exports = Widget;
