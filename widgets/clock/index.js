var moment = require('moment');

var longDate = 'dddd, Do MMMM',
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
}


Widget.prototype.tick = function () {
	this.el.innerHTML = getHtml(this.size);
};


module.exports = Widget;
