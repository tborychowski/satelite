'use strict';

const request = require('request-promise');

function weather(city, unit) {
	city = city || 'Dublin, Ireland';
	unit = unit || 'c';
	const url = 'http://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast ' +
		`where u="${unit}" AND woeid in ` +
		`(select woeid from geo.places(1) where text="${city}")&format=json`;

	return request(url)
		.then(resp => JSON.parse(resp).query.results.channel)
		.catch(console.error.bind(console));
}

function processData(json) {
	const atmo = json.atmosphere;
	const units = json.units;
	const cond = json.item.condition;
	const location = json.location.city + ', ' + json.location.country;
	const wind = Math.round(parseFloat(json.wind.speed)) + units.speed;
	// bug in api - must convert to C
	const feelslike = Math.round((json.wind.chill - 32) * 5 / 9) + '°' + units.temperature;
	const forecast = json.item.forecast;
	forecast.length = 5;
	return {
		location,
		desc: cond.text,
		temp: cond.temp + '°' + units.temperature,
		code: cond.code,
		feelslike,
		wind,
		humidity: atmo.humidity + '%',
		pressure: atmo.pressure + units.pressure,
		forecast,
		link: json.link
	};
}


module.exports = (city, unit) => weather(city, unit).then(processData);
