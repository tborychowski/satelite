'use strict';

const FS = require('fs');
const Path = require('path');

const themesRoot = Path.join(__dirname, '..', 'themes');
const theme = 'default';

function injectCss (css) {
	let link, stat;
	try { stat = FS.statSync(css); } catch (e) { stat = null; }
	if (!stat || !stat.isFile()) return;
	link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = css;
	document.head.appendChild(link);
}


function render () {
	let fileName = Path.join(themesRoot, theme, 'index.html');
	let tpl = FS.readFileSync(fileName).toString();
	document.getElementById('app').innerHTML = tpl;
}

function injectStyle () {
	injectCss(Path.join(themesRoot, theme, 'index.css'));
}


module.exports = {
	render,
	injectStyle,
};
