(function () {
	'use strict';

	const theme = require('./theme');
	const widgets = require('./widgets');
	const shell = require('electron').shell;
	const exec = require('child_process').exec;


	// must be in order
	theme.render();
	widgets.init();
	widgets.injectStyles();
	theme.injectStyle();
	widgets.render();



	document.addEventListener('click', (e) => {
		var el = e.target;

		// don't open links in itself
		if (el.matches('widget a') || el.matches('widget a *')) e.preventDefault();

		// open links in browser
		if (el.matches('widget a.link *')) el = el.closest('.link');
		if (el.matches('widget a.cmd')) {
			let cmd = el.getAttribute('href');
			if (cmd && cmd !== '#') exec(cmd, (err) => {
				if (err) console.error(err);
			});
		}
		else if (el.matches('widget a.link')) {
			let lnk = el.getAttribute('href');
			if (lnk && lnk !== '#') shell.openExternal(el.href);
		}

	});


}());
