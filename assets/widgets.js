var FS = require('fs'),
	Path = require('path');

var widgets = {},
	widgetsRoot = Path.join(__dirname, '..', 'widgets'),
	config = require(Path.join(__dirname, '..', 'config.json'));

if (!config || !config.widgets) config = { widgets: {} };

function injectStyle (css) {
	var link, stat, css;
	try { stat = FS.statSync(css); } catch (e) { stat = null; }
	if (!stat || !stat.isFile()) return;
	link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = css;
	document.head.appendChild(link)
}


function getAttrs (el) {
	var attrs = {};
	Array.prototype.slice.call(el.attributes).forEach(function(item) {
		attrs[item.name] = item.value;
	});
	return attrs;
}


function init () {
	FS.readdirSync(widgetsRoot)
		.filter(function(f) {
			return FS.statSync(Path.join(widgetsRoot, f)).isDirectory();
		})
		.forEach(function (w) {
			widgets[w] = require(Path.join(widgetsRoot, w, 'index.js'));
		});
}


function injectWidgetsStyles () {
	for (var w in widgets) {
		injectStyle(Path.join(widgetsRoot, w, 'index.css'))
	}
}


function render () {
	var nodes = document.getElementsByTagName('widget'), attrs, cfg;
	for (var i = 0, node; node = nodes[i]; i++) {
		attrs = getAttrs(node);
		attrs.interval = (attrs.interval || 1) * 1000;
		cfg = config.widgets[attrs.widget] || {};
		if (widgets[attrs.widget]) {
			new widgets[attrs.widget](node, attrs, cfg);
		}
	}
}


module.exports = {
	init: init,
	injectStyles: injectWidgetsStyles,
	render: render,
};
