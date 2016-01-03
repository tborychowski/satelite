'use strict';

const OS = require('os');
const Path = require('path');
const shell = require('electron').shell;
const bins = require('bins');

function getHtml (data) {
	var emptyCls = (data && data.size ? '' : ' empty');
	return '<div class="details' + emptyCls + '">' +
			'<span class="items">' + data.items + ' item' + (data.items > 1 ? 's' : '') + '</span>' +
			'<span class="size">' + data.hsize + '</span>' +
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
		this.addEvents();
	}

	addEvents () {
		let el = this.el, tick = this.tick.bind(this);
		el.onclick = (e) => {
			if (e.target.matches('.empty-trash')) return bins.empty().then(tick);
			if (process.platform === 'linux') shell.openExternal('trash:///');
			else if (process.platform === 'win32') shell.openItem('shell:RecycleBinFolder');
			else shell.openItem(Path.join(OS.homedir(), '.Trash'));
		};

		el.ondragover = (e) => {
			e.preventDefault();
			el.classList.add('dragover');
		};

		el.ondragleave = el.ondragend = (e) => {
			e.preventDefault();
			el.classList.remove('dragover');
		};

		el.ondrop = (e) => {
			e.preventDefault();
			el.classList.remove('dragover');
			Array.from(e.dataTransfer.files || [])
				.map(f => f.path)
				.forEach(shell.moveItemToTrash);
		};
	}

	render (data) {
		let newHtml = getHtml(data || {});
		if (this.oldHtml !== newHtml) this.el.innerHTML = this.oldHtml = newHtml;
	}

	tick () {
		bins.get().then(this.render.bind(this));
	}
}

module.exports = Widget;
