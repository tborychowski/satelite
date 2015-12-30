var gmail = require('./gmail');
var Path = require('path');

function getHtml (size, data) {
	var icon = data.unread ? 'ion-email-unread' : 'ion-email';
	return '<a class="link" href="https://mail.google.com/mail/u/0/#inbox">' +
			'<i class="' + icon + '"></i> ' +
			(data.unread ? '<span class="badge">' + data.unread + '</span>' : '')+
		'</a>';
}


function Widget (el, params, config) {
	this.el = el;
	this.size = params.size;
	this.config = config;
	this.render();
}


Widget.prototype.notify = function (data) {
	if (!data) return;
	new Notification('Gmail', {
		body: 'You have ' + data + ' unread message' + (data > 1 ? 's' : ''),
		icon: 'file://' + Path.resolve(__dirname, 'icon.png')
	});
};


Widget.prototype.render = function (data) {
	data = data || {};
	var newHtml = getHtml(this.size, data);
	if (this.oldHtml !== newHtml) {
		this.notify(data.unread);
		this.el.innerHTML = this.oldHtml = newHtml;
	}
};


Widget.prototype.tick = function () {
	gmail.check(this.config)
		.then(this.render.bind(this));
};


module.exports = Widget;
