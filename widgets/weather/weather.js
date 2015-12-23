var Parser = require('xml2js');
var Req = require('request-promise');
var url = '';

function parseXml (xml) {
	// var res = Parser.toJson(resp, { object: true, coerce: true });
	return new Promise(function (resolve, reject) {
		Parser.parseString(xml, function (err, resp) {
			if (err || !resp) return reject(err);
			resp = resp.rss.channel[0];
			if (!resp) return reject('Parse error');
			resolve(resp);
		});
	});
}


function processData(json) {
	var loc = json['yweather:location'][0].$,
		wind = json['yweather:wind'][0].$,
		atmo = json['yweather:atmosphere'][0].$,
		cond = json.item[0]['yweather:condition'][0].$,
		units = json['yweather:units'][0].$,
		forecast = json.item[0]['yweather:forecast'].map(function (item) { return item.$; });
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


module.exports = function (woeid) {
	url = 'http://weather.yahooapis.com/forecastrss?u=c&w=' + woeid;
	return Req(url)
		.then(parseXml)
		.then(processData);
};




