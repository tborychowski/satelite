'use strict';

const FS = require('fs');
const Path = require('path');

let widgets = [],
	widgetsRoot = Path.join(__dirname, '..', 'widgets'),
	config = require(Path.join(__dirname, '..', 'config.json'));

if (!config) config = {};


function injectStyle (css) {
	let link, stat;
	try { stat = FS.statSync(css); } catch (e) { stat = null; }
	if (!stat || !stat.isFile()) return;
	link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = css;
	document.head.appendChild(link);
}


function getAttrs (el) {
	let attrs = {};
	Array.prototype.slice.call(el.attributes).forEach((item) => attrs[item.name] = item.value);
	return attrs;
}



function init () {
	let nodes = document.getElementsByTagName('widget'), node, i = 0, attrs;

	for (; node = nodes[i]; i++) {
		attrs = getAttrs(node);
		let cfg = config[attrs.config || attrs.widget] || {};
		let interval = (attrs.interval ? attrs.interval * 1000 : null);
		let stylePath = Path.join(widgetsRoot, attrs.widget, 'index.css');
		let module = require(Path.join(widgetsRoot, attrs.widget, 'index.js'));
		widgets.push({ name: attrs.widget, config: cfg, attrs, node, interval, stylePath, module });
	}
}


function injectStyles () {
	let styles = {};
	widgets.forEach((w) => styles[w.stylePath] = 1);	// for uniqueness
	styles = Object.keys(styles);
	styles.forEach(injectStyle);
}

function repeat () {
	this.instance.tick.call(this.instance);
	if (this.interval) setTimeout(this.repeat.bind(this), this.interval);
}

function render () {
	widgets.forEach(function (w) {
		if (!w.module) return;
		w.node.classList.add(w.name, w.attrs.size);
		w.instance = new w.module(w.node, w.attrs, w.config);
		w.repeat = repeat.bind(w);
		w.repeat();
	});
}


module.exports = {
	init,
	injectStyles,
	render,
};
