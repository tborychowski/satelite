var moment = require('moment');

var longDate = 'Do MMMM YYYY',
	shortDate = 'DD/MM/YYYY',
	hour = 'H:mm';


function getHtml (size) {
	var now = moment(),
		dateFormat = size === 'large' ? longDate : shortDate;

	return '<div class="clock clock-' + size + '">' +
		'<div class="clock-hour">' + now.format(hour) + '</div>' +
		'<div class="clock-date">' + now.format(dateFormat) + '</div>' +
		'</div>';
}


function Widget (el, params) {
	this.el = el;
	this.size = params.size;
	this.interval = params.interval;
	this.tick();
}

Widget.prototype.render = function () {
	this.el.innerHTML = getHtml(this.size);
};


Widget.prototype.tick = function () {
	this.render();
	setTimeout(this.tick.bind(this), this.interval);
};


module.exports = Widget;
