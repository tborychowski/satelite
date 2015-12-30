var request = require('request-promise');
var moment = require('moment');

// moment relative formatting
var relatives = {
	sameDay: '[Today]',
	nextDay: '[Tomorrow]',
	nextWeek: 'dddd',
	lastDay: '[Yesterday]',
	lastWeek: '[Last] dddd',
	sameElse: 'DD/MM/YYYY'
};
// translate event frequency for moment "add" function
var freqs = {
	DAILY: 'days',
	WEEKLY: 'weeks',
	MONTHLY: 'months',
	YEARLY: 'years'
};

function parseDate (val) {
	// parse just date, e.g. 20151230
	var m = /^(\d{4})(\d{2})(\d{2})$/.exec(val);
	if (m) return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
	// parse date and time, e.g. 20151218T150000Z
	var reg = new RegExp(/^(\d{4})(\d{2})(\d{2}T\d{2})(\d{2})(\d{2}Z?)$/);
	if (reg.test(val)) return new Date(val.replace(reg, '$1-$2-$3:$4:$5'));
}

var handlers = {
	summary: function (v) { return v; },
	description: function (v) { return v; },
	dtstart: parseDate,
	dtend: parseDate,
	rrule: function (params) {
		//e.g FREQ=YEARLY;WKST=MO;UNTIL=20110504T000000Z
		var rules = {};
		params.split(';').forEach(function (r) {
			r = r.split('=');
			var n = r[0].toLowerCase(), v = r[1];
			if (n === 'until') rules[n] = parseDate(v);
			else rules[n] = v;
		});
		return rules;
	}
};



/**
 * This is by no means a comprehensive ICS parser.
 * This doesn't cover a lot of complex rules described in the specs.
 * This only covers regular, full-day and recurrent events (hopefully)
 */
function parseICS (str) {
	var calName = '', events = [], lines = str.split('\n'), e = 0, read = false;

	for (var i = 0, len = lines.length; i < len; i++) {
		var line = lines[i].trim();

		// gather multiline strings (they are indented with a space)
		while (i + 1 < len && lines[i + 1].match(/^ /)) line += lines[i++].trim();

		var dataLine = line.split(':');
		if (dataLine.length < 2) continue;

		var name = dataLine[0].split(';')[0].toLowerCase();

		dataLine.shift();
		var value = dataLine.join(':').replace('\\,', ',');

		if (name === 'x-wr-calname') calName = value;
		else if (name === 'begin' && value === 'VEVENT') {
			events[e] = { calendar: calName };
			read = true;
		}
		else if (name === 'end' && value === 'VEVENT') { e++; read = false; }
		else if (name === 'begin' && value === 'VALARM') read = false;
		else if (name === 'end' && value === 'VALARM') read = true;
		else if (read && name in handlers) events[e][name] = handlers[name](value);
	}
	return events;
}


function getFutureEvents (events) {
	return events.filter(function (ev) {
		var now = new Date();
		if (ev.rrule) {
			var end = now;
			if (ev.rrule.until) end = ev.rrule.until;
			if (ev.rrule.count) end = moment(ev.dtend).add(ev.rrule.count, freqs[ev.rrule.freq]).toDate();
			return end >= now;	// if no "until" or "count" - event repeats forever
		}
		return ev.dtend >= now;
	});
}


function updateRecurrentEvent (ev, addYr) {
	var freq = ev.rrule.freq;
	var now = moment().add(addYr || 0, 'year');
	var y = now.year(), m = now.month(), w = now.week(), d = now.date();

	ev.start = ev.start.year(y);
	ev.end = ev.end.year(y);

	if (freq === 'WEEKLY')  {
		ev.start = ev.start.week(w);
		ev.end = ev.end.week(w);
	}
	if (freq === 'MONTHLY' || freq === 'DAILY')  {
		ev.start = ev.start.month(m);
		ev.end = ev.end.month(m);
	}
	if (freq === 'DAILY')  {
		ev.start = ev.start.date(d);
		ev.end = ev.end.date(d);
	}
	ev.dtstart = ev.start.toDate();
	ev.dtend = ev.end.toDate();

	// if recurrent event has already happened this year - update it to the next year
	if (ev.dtend < new Date()) return updateRecurrentEvent(ev, 1);

	delete ev.rrule;
	return ev;
}
function momentize (events) {
	events.forEach(function (ev) {
		ev.start = moment(ev.dtstart);
		ev.end = moment(ev.dtend);
		ev.fullday = ev.end.diff(ev.start, 'days') >= 1;
		ev.recurrent = !!ev.rrule;
		if (ev.recurrent) ev = updateRecurrentEvent(ev);	// update recurrent events
	});
	return events;
}


function limitTo (days) {
	return function (events) {
		days = days || 2;
		var lim = new Date();
		lim.setDate(lim.getDate() + days);
		return events.filter(function (ev) { return ev.dtstart <= lim; });
	};
}


function getEventsForDay (events, day) {
	return events.filter(function (ev) {
		if (ev.fullday) return day.isBetween(ev.dtstart, ev.dtend);
		return day.isSame(ev.dtstart, 'day') ||
			day.isSame(ev.dtend, 'day');
	});
}
function groupByDays (showDays) {
	return function (events) {
		var days = [], day = moment();
		while (showDays) {
			var dayEvents = getEventsForDay(events, day);
			if (dayEvents.length) days.push({ day: day.calendar(null, relatives), events: dayEvents });
			day = day.add(1, 'days');
			showDays--;
		}
		return days;
	};
}


function getAgenda (config) {
	var cals = config.map(function (url) {
		return request(url)
			.then(parseICS)
			.then(getFutureEvents)
			.then(momentize)
			.then(getFutureEvents);
	});

	return Promise.all(cals).then(function (events) {
		// merge events from all calendars
		return [].concat.apply([], events).sort(function (a, b) { return a.dtstart - b.dtstart; });
	});
}



module.exports = {
	limitTo: limitTo,
	groupByDays: groupByDays,
	getAgenda: getAgenda,
};
