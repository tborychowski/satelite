var gmail = require('./gmail');

function getHtml (size, resp) {
	resp = resp || { unread: 0 };
	var icon = resp.unread ? 'ion-email-unread' : 'ion-email';
	return '<div class="gmail gmail-' + size + '">' +
		'<a class="link" href="https://mail.google.com/mail/u/0/#inbox">' +
			'<i class="' + icon + '"></i> ' + resp.unread +
		'</a></div>';
}


function Widget (el, params, config) {
	this.el = el;
	this.size = params.size;
	this.config = config;
	this.render();
}



Widget.prototype.render = function (resp) {
	this.el.innerHTML = getHtml(this.size, resp);
};


Widget.prototype.tick = function () {
	gmail.check(this.config)
		.then(this.render.bind(this));
};


module.exports = Widget;
