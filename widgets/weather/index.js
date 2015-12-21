var Parser = require('xml2js');
var Req = require('request-promise');

var theme = 'img-real';

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
		forecast: forecast
	};
}

function buildHtml (json) {
	var forecast = json.forecast.map(function (day) {
			return '<td class="weather-day">' +
				'<div class="weather-date">' + day.day + '</div>' +
				'<img class="weather-icon" src="../widgets/weather/' + theme + '/' + day.code + '.png" />' +
				'<div class="weather-temp">' + day.low + '°-' + day.high + '°</div>' +
				// '<div class="weather-desc">' + day.text + '</div>' +
			'</td>';
	}).join('');

	return '<div class="weather">' +
		'<div class="weather-today">' +
			'<img class="weather-icon" src="../widgets/weather/' + theme + '/' + json.code + '.png" />' +
			'<div class="weather-today-text">' +
				'<div class="weather-location">' + json.location + '</div>' +
				'<div class="weather-desc">' + json.desc + '</div>' +
				'<div class="weather-wind">Temp: ' + json.temp + '</div>' +
				'<div class="weather-wind">Real: ' + json.feelslike + '</div>' +
				'<div class="weather-wind">Wind: ' + json.wind + '</div>' +
				'<div class="weather-wind">Humid: ' + json.humidity + '</div>' +
				'<div class="weather-wind">Press: ' + json.pressure + '</div>' +
			'</div>' +
		'</div>' +
		'<table class="weather-forecast"><tr>' + forecast + '</tr></table>';
		'</div>';
}



function Widget (el, params) {
	this.el = el;
	this.size = params.size;
	this.interval = params.interval;
	this.url = 'http://weather.yahooapis.com/forecastrss?u=c&w=' + (params.woeid || '560743');	// dublin

	this.tick();
}


Widget.prototype.render = function () {
	Req(this.url)
		.then(parseXml)
		.then(processData)
		.then(buildHtml)
		.then(function (html) { this.el.innerHTML = html; }.bind(this))
		.catch(function (err) {
			console.error(err);
		});
};



Widget.prototype.tick = function () {
	this.render();
	setTimeout(this.tick.bind(this), this.interval);
};


module.exports = Widget;



