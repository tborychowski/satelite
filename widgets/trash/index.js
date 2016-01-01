'use strict';

const trash = require('./trash');

function getHtml (data) {
	var emptyCls = (data && data.size ? '' : ' empty');
	return '<div class="details' + emptyCls + '">' +
			'<span class="items">' + data.items + ' item' + (data.items > 1 ? 's' : '') + '</span>' +
			'<span class="size">' + data.size + ' MB</span>' +
			'<a href="#" class="link empty-trash">empty</a>' +
		'</div>' +
		'<i class="ion-trash-a' + emptyCls + '"></i>';
}


class Widget {
	constructor (el, params, config) {
		this.el = el;
		this.size = params.size;
		this.config = config;
		this.render();

		let tick = this.tick.bind(this);
		el.addEventListener('click', (e) => {
			if (e.target.matches('.empty-trash')) trash.empty().then(tick);
		});
	}

	render (data) {
		let newHtml = getHtml(data || {});
		if (this.oldHtml !== newHtml) this.el.innerHTML = this.oldHtml = newHtml;
	}

	tick () {
		trash.get().then(this.render.bind(this));
	}
}

module.exports = Widget;
