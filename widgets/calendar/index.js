var calendar = require('./calendar');
var moment = require('moment');

function getDate (date) {
	var d = moment(date), now = moment().startOf('day');
	if (d.valueOf() <= now.valueOf()) d = now;
	return d.format('YYYY-MM-DD');
}

function getHtml (size, data) {
	data = data || [];
	var list = data.map(function (ev) {
		return '<li>' + getDate(ev.dtstart) + '&nbsp; ' + ev.summary + '</li>';
	});
	return '<ul>' + list.join('') + '</ul>';
}


function Widget (el, params, config) {
	this.el = el;
	this.size = params.size;
	this.config = config;
	this.render();
}


Widget.prototype.render = function (data) {
	var newHtml = getHtml(this.size, data);
	if (this.oldHtml !== newHtml) this.el.innerHTML = this.oldHtml = newHtml;
};


Widget.prototype.tick = function () {
	calendar
		.getAgenda(this.config)
		.then(calendar.limitTo(3))
		.then(this.render.bind(this))
		.catch(function (err) { console.error('' + err); })
};


module.exports = Widget;
