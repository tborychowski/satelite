var FS = require('fs'),
	Path = require('path');

var themesRoot = Path.join(__dirname, '..', 'themes'), theme = 'default';

function injectStyle (css) {
	var link, stat, css;
	try { stat = FS.statSync(css); } catch (e) { stat = null; }
	if (!stat || !stat.isFile()) return;
	link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = css;
	document.head.appendChild(link)
}


function render () {
	var fileName = Path.join(themesRoot, theme, 'index.html'),
		tpl = FS.readFileSync(fileName).toString();
	document.getElementById('app').innerHTML = tpl;
}

function injectThemeStyle () {
	injectStyle(Path.join(themesRoot, theme, 'index.css'))
}


module.exports = {
	render: render,
	injectStyle: injectThemeStyle,
};
