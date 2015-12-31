'use strict';

const trash = require('./trash');

function getHtml (size) {
	return '<i class="ion-trash-a"></i>' +
		'<span class="size">' + size + '</span>' +
		'<a href="#" class="link empty-trash">empty</a>';
}


class Widget {
	constructor (el, params, config) {
		this.el = el;
		this.size = params.size;
		this.config = config;
		this.render();

		el.addEventListener('click', function (e) {
			if (e.target.matches('.empty-trash')) trash.empty().then(this.tick.bind(this));
		}.bind(this));
	}

	render (data) {
		let newHtml = getHtml.call(this, data || '0 MB');
		if (this.oldHtml !== newHtml) this.el.innerHTML = this.oldHtml = newHtml;
	}

	tick () {
		trash.get().then(this.render.bind(this));
	}
}

module.exports = Widget;
