var FS = require('fs'),
	Path = require('path');

var widgets = [],
	widgetsRoot = Path.join(__dirname, '..', 'widgets'),
	config = require(Path.join(__dirname, '..', 'config.json'));

if (!config || !config.widgets) config = { widgets: {} };

function injectStyle (css) {
	var link, stat;
	try { stat = FS.statSync(css); } catch (e) { stat = null; }
	if (!stat || !stat.isFile()) return;
	link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = css;
	document.head.appendChild(link);
}


function getAttrs (el) {
	var attrs = {};
	Array.prototype.slice.call(el.attributes).forEach(function(item) {
		attrs[item.name] = item.value;
	});
	return attrs;
}



function init () {
	var nodes = document.getElementsByTagName('widget'), node, i = 0, attrs;

	for (; node = nodes[i]; i++) {
		attrs = getAttrs(node);
		widgets.push({
			name: attrs.widget,
			attrs: attrs,
			config: config.widgets[attrs.config || attrs.widget] || {},
			interval: (attrs.interval ? attrs.interval * 1000 : null),
			stylePath: Path.join(widgetsRoot, attrs.widget, 'index.css'),
			node: node,
			module: require(Path.join(widgetsRoot, attrs.widget, 'index.js')),
		});
	}
}


function injectWidgetsStyles () {
	var styles = {};
	widgets.forEach(function (w) {
		styles[w.stylePath] = 1;	// for uniqueness
	});
	styles = Object.keys(styles);

	styles.forEach(injectStyle);
}

function repeat () {
	// console.log(this.name);
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
	init: init,
	injectStyles: injectWidgetsStyles,
	render: render,
};
