'use strict';

function getItemHtml (item) {
	if (typeof item === 'string') item = { path: item };

	let cls = 'link';
	if (item.cmd) {
		cls += ' cmd';
		item.path = item.cmd;
	}
	item.name = item.name || item.path.replace(/\/$/, '').split('/').pop();
	item.path = item.path || item.cmd || '';
	item.icon = item.icon || 'ion-folder';

	return '<li><a class="' + cls + '" href="' + item.path + '" title="' + item.path + '">' +
			'<i class="' + item.icon + '"></i><span class="name">' + item.name + '</span>' +
		'</a></li>';
}


function getGroupHtml (group) {
	group = group || {};
	if (typeof group === 'string' || group.path || group.cmd) group = {items: [group]};
	let name = group.name ? '<h1>' + group.name + '</h1>' : '';
	return name + '<ul>' + group.items.map(getItemHtml).join('') + '</ul>';
}


class Widget {
	constructor (el, params, config) {
		this.el = el;
		this.size = params.size;
		this.config = config;
		this.render();
	}

	render () {
		if (!Array.isArray(this.config)) this.config = [this.config];
		let newHtml = this.config.map(getGroupHtml).join('');
		if (this.oldHtml !== newHtml) this.el.innerHTML = this.oldHtml = newHtml;
	}

	tick () {
		this.render();
	}
}

module.exports = Widget;
