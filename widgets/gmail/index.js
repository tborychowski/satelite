var gmail = require('./gmail');

function getHtml (size, resp) {
	var icon = resp.unread ? 'ion-email-unread' : 'ion-email';
	return '<div class="gmail gmail-' + size + '">' +
		'<a class="link" href="https://mail.google.com/mail/u/0/#inbox">' +
			'<i class="' + icon + '"></i> ' + resp.unread +
		'</a></div>';
}


function Widget (el, params, config) {
	this.el = el;
	this.size = params.size;
	this.interval = params.interval;
	this.config = config;
	this.render({ unread: 0 });
	this.tick();
}


Widget.prototype.reload = function () {
	gmail.check(this.config)
		.then(this.render.bind(this));
}

Widget.prototype.render = function (resp) {
	this.el.innerHTML = getHtml(this.size, resp);
};


Widget.prototype.tick = function () {
	this.reload();
	setTimeout(this.tick.bind(this), this.interval);
};


module.exports = Widget;
