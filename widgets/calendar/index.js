'use strict';

const calendar = require('./calendar');

function getEventHtml (ev) {
	var cls = ev.fullday ? 'event fullday' : 'event',
		time = ev.fullday ? '' : '<em>' + ev.start.format('HH:mm') + '</em>';
	return '<li class="' + cls + '">' + time + ev.summary + '</li>';
}

function getHtml (size, data) {
	data = data || [];
	return data.map(function (day) {
		return '<h1>' + day.day + '</h1><ul>' + day.events.map(getEventHtml).join('') + '</ul>';
	}).join('') + '<i class="badge ion-calendar"></i>';
}




class Widget {
	constructor (el, params, config) {
		this.el = el;
		this.size = params.size;
		this.config = config;
		this.showDays = params.showdays || 2; // show agenda for this many days
		this.render();
	}

	render (data) {
		let newHtml = getHtml(this.size, data);
		if (this.oldHtml !== newHtml) this.el.innerHTML = this.oldHtml = newHtml;
	}

	tick () {
		calendar
			.getAgenda(this.config)
			.then(calendar.limitTo(this.showDays))
			.then(calendar.groupByDays(this.showDays))
			.then(this.render.bind(this))
			.catch(function (err) { console.error('' + err); });
	}
}


module.exports = Widget;
