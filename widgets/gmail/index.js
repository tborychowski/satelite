'use strict';

const gmail = require('./gmail');
const Path = require('path');

function getHtml (size, data) {
	var icon = data.unread ? 'ion-email-unread' : 'ion-email';
	return '<a class="link" href="https://mail.google.com/mail/u/0/#inbox">' +
			'<i class="' + icon + '"></i> ' +
			(data.unread ? '<span class="badge">' + data.unread + '</span>' : '')+
		'</a>';
}



class Widget {
	constructor (el, params, config) {
		this.el = el;
		this.size = params.size;
		this.config = config;
		this.works = true;
		this.render();
	}

	notify (data) {
		if (!data) return;
		if (!this.config.notifications) return;
		new Notification('Gmail', {
			body: 'You have ' + data + ' unread message' + (data > 1 ? 's' : ''),
			icon: 'file://' + Path.resolve(__dirname, 'icon.png')
		});
	}

	render (data) {
		data = data || {};
		if (!this.works) return;
		var newHtml = getHtml(this.size, data);
		if (this.oldHtml !== newHtml) {
			this.notify(data.unread);
			this.el.innerHTML = this.oldHtml = newHtml;
		}
	}

	tick () {
		gmail.check(this.config).then(this.render.bind(this))
		.catch(function () {
			this.works = false;
		}.bind(this));
	}
}

module.exports = Widget;
