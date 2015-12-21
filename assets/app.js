(function () {
	var FS = require('fs'),
		Path = require('path');

	var widgets = {};
	var widgetsRoot = Path.join(__dirname, '..', 'widgets');

	function getWidgets () {

		FS.readdirSync(widgetsRoot)
			.filter(function(f) {
				return FS.statSync(Path.join(widgetsRoot, f)).isDirectory();
			})
			.forEach(function (w) {
				widgets[w] = require(Path.join(widgetsRoot, w, 'index.js'));
			});
	}


	function renderThemeTemplate (theme) {
		var tpl = FS.readFileSync('./themes/' + theme + '/index.html').toString();
		document.getElementById('app').innerHTML = tpl;
	}


	function getWidgetAttrs (el) {
		var attrs = {};
		Array.prototype.slice.call(el.attributes).forEach(function(item) {
			attrs[item.name] = item.value;
		});
		return attrs;
	}


	function injectWidgetsCss () {
		var head = document.head, link, stat;

		for (var w in widgets) {
			css = Path.join(widgetsRoot, w, 'index.css');
			try { stat = FS.statSync(css); } catch (e) { stat = null; }
			if (!stat || !stat.isFile()) continue;
			link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = css;
			head.appendChild(link)
		}
	}

	function initWidgets () {
		var nodes = document.getElementsByTagName('widget');

		for (var i = 0, node; node = nodes[i]; i++) {
			var attrs = getWidgetAttrs(node);
			attrs.interval = (attrs.interval || 1) * 1000
			if (widgets[attrs.widget]) new widgets[attrs.widget](node, attrs);
		}
	}


	renderThemeTemplate('default');
	getWidgets();
	injectWidgetsCss();
	initWidgets();

}());