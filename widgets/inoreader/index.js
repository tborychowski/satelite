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
	this.config = config;
	this.render();
}


Widget.prototype.render = function (resp) {
	this.el.innerHTML = getHtml(this.size, resp || 0);
};


Widget.prototype.tick = function () {
	inoreader
		.config(this.config)
		.then(inoreader.getTotalCount)
		.then(this.render.bind(this))
		.catch(function (err) { console.error('' + err); })
};


module.exports = Widget;
