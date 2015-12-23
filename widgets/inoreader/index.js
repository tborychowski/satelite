var inoreader = require('./inoreader');

function getHtml (size, resp) {
	return '<div class="inoreader inoreader-' + size + '">' +
		'<a class="link" href="https://www.inoreader.com/all_articles">' +
			'<i class="ion-social-rss"></i> ' + resp +
		'</a></div>';
}


function Widget (el, params, config) {
	this.el = el;
	this.size = params.size;
	this.interval = params.interval;
	this.config = config;
	this.render(0);
	this.tick();
}


Widget.prototype.reload = function () {
	inoreader
		.config(this.config)
		.then(inoreader.getTotalCount)
		.then(this.render.bind(this))
		.catch(function (err) { console.error('' + err); })
}

Widget.prototype.render = function (resp) {
	this.el.innerHTML = getHtml(this.size, resp);
};


Widget.prototype.tick = function () {
	this.reload();
	setTimeout(this.tick.bind(this), this.interval);
};


module.exports = Widget;
