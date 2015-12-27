(function () {
	var theme = require('./theme');
	var widgets = require('./widgets');
	var shell = require('electron').shell;
	var exec = require('child_process').exec;


	// must be in order
	theme.render();
	widgets.init();
	widgets.injectStyles();
	theme.injectStyle();
	widgets.render();



	document.addEventListener('click', function (e) {
		var el = e.target;

		// don't open links in itself
		if (el.matches('widget a') || el.matches('widget a *')) {
			e.preventDefault();
		}

		// open links in browser
		if (el.matches('widget a.link *')) el = el.closest('.link');
		if (el.matches('widget a.cmd')) {
			exec(el.getAttribute('href'), function (err) {
				if (err) console.error(err);
			});
		}
		else if (el.matches('widget a.link')) shell.openExternal(el.href);


	});



}());
