var gmail = require('./gmail');

function getHtml (size, data) {
	data = data || {};
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



Widget.prototype.render = function (data) {
	var newHtml = getHtml(this.size, data);
	if (this.oldHtml !== newHtml) this.el.innerHTML = this.oldHtml = newHtml;
};


Widget.prototype.tick = function () {
	gmail.check(this.config)
		.then(this.render.bind(this));
};


module.exports = Widget;
