'use strict';

const inoreader = require('./inoreader');
const Path = require('path');

function getHtml (size, resp) {
	return '<a class="link" href="https://www.inoreader.com/all_articles">' +
			'<i class="ion-social-rss"></i>' +
			(resp ? '<span class="badge">' + resp + '</span>' : '') +
		'</a>';
}


class Widget {
	constructor (el, params, config) {
		this.el = el;
		this.size = params.size;
		this.config = config;
		this.render();
	}

	notify (data) {
		if (!data) return;
		new Notification('Inoreader', {
			body: 'You have ' + data + ' unread feed' + (data > 1 ? 's' : ''),
			icon: 'file://' + Path.resolve(__dirname, 'icon.png')
		});
	}

	render (data) {
		var newHtml = getHtml(this.size, data);
		if (this.oldHtml !== newHtml) {
			this.notify(data);
			this.el.innerHTML = this.oldHtml = newHtml;
		}
	}

	tick () {
		inoreader
			.config(this.config)
			.then(inoreader.getTotalCount)
			.then(this.render.bind(this))
			.catch(function (err) { console.error('' + err); });
	}
}

module.exports = Widget;
