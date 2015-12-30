'use strict';

const moment = require('moment');

let longDate = 'dddd, Do MMMM',
	shortDate = 'DD/MM/YYYY',
	hour = 'H:mm';


function getHtml (size) {
	var now = moment(),
		dateFormat = size === 'large' ? longDate : shortDate;

	return '<div class="clock-hour">' + now.format(hour) + '</div>' +
		'<div class="clock-date">' + now.format(dateFormat) + '</div>';
}


class Widget {
	constructor(el, params) {
		this.el = el;
		this.size = params.size;
	}

	tick() {
		let newHtml = getHtml(this.size);
		if (this.oldHtml !== newHtml) this.el.innerHTML = this.oldHtml = newHtml;
	}
}

module.exports = Widget;
