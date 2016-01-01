'use strict';

const Parser = require('xml2js');
const Req = require('request-promise');
var url = '';

function parseXml (xml) {
	// var res = Parser.toJson(resp, { object: true, coerce: true });
	return new Promise((resolve, reject) => {
		Parser.parseString(xml, (err, resp) => {
			if (err || !resp) return reject(err);
			resp = resp.rss.channel[0];
			if (!resp) return reject('Parse error');
			resolve(resp);
		});
	});
}

function getNode (json, name) {
	return json['yweather:' + name][0].$;
}

function processData(json) {
	let loc = getNode(json, 'location'),
		wind = getNode(json, 'wind'),
		atmo = getNode(json, 'atmosphere'),
		units = getNode(json, 'units'),
		cond = getNode(json.item[0], 'condition'),
		forecast = json.item[0]['yweather:forecast'].map((item) => item.$);

	return {
		location: loc.city + ', ' + loc.country,
		desc: cond.text,
		temp: cond.temp + '°' + units.temperature,
		code: cond.code,
		feelslike: wind.chill + '°' + units.temperature,
		wind: Math.round(parseFloat(wind.speed)) + units.speed,
		humidity: atmo.humidity + '%',
		pressure: atmo.pressure + units.pressure,
		forecast: forecast,
		link: json.link,
		rssLink: url
	};
}


module.exports = (woeid) => {
	return Req(url = 'http://weather.yahooapis.com/forecastrss?u=c&w=' + woeid)
		.then(parseXml)
		.then(processData);
};




