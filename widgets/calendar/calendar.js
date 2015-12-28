var request = require('request-promise');

function parseDate (val) {
	// parse just date, e.g. 20151230
	var m = /^(\d{4})(\d{2})(\d{2})$/.exec(val);
	if (m) return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
	// parse date and time, e.g. 20151218T150000Z
	var reg = new RegExp(/^(\d{4})(\d{2})(\d{2}T\d{2})(\d{2})(\d{2}Z)$/);
	if (reg.test(val)) return new Date(val.replace(reg, '$1-$2-$3:$4:$5'));
}

function sort (a, b) { return a.dtstart - b.dtstart; }

var handlers = {
	summary: function (v) { return v; },
	description: function (v) { return v; },
	dtstart: parseDate,
	dtend: parseDate
};

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
	var now = new Date();
	return events.filter(function (ev) {
		return ev.dtend >= now;
	});
}

function limitTo (days) {
	days = days || 3;
	var lim = new Date();
    lim.setDate(lim.getDate() + days);

	return function (events) {
		return events.filter(function (ev) {
			return ev.dtstart <= lim;
		});
	}
}


function getAgenda (config) {
	var cals = config.map(function (url) {
		return request(url).then(parseICS).then(getFutureEvents);
	});
	return Promise.all(cals).then(function (data) {
		return [].concat.apply([], data).sort(sort);
	});
}


module.exports = {
	getAgenda: getAgenda,
	limitTo: limitTo
};
