var weather = require('./weather');
var theme = 'img-real';


function getForecastHtml (day) {
	day = day || {};
	return '<td class="weather-day">' +
		'<div class="weather-date">' + (day.day || '') + '</div>' +
		'<img class="weather-icon" src="../widgets/weather/' + theme + '/' + (day.code || 30) + '.png" />' +
		'<div class="weather-temp">' + (day.low || '') + '°-' + (day.high || '') + '°</div>' +
		// '<div class="weather-desc">' + (day.text || '') + '</div>' +
	'</td>';
}

function getHtml (json) {
	json = json || { forecast: [1,1,1,1,1] };
	var forecast = json.forecast.map(getForecastHtml).join('');

	return '<div class="weather-today">' +
			'<div class="weather-today-text">' +
				'<div class="weather-location"><a class="link" href="' + (json.rssLink || '#') + '">' +
					(json.location || '') + '</a></div>' +
				'<div class="weather-desc">' + (json.desc || '') + '</div>' +
				'<div class="weather-wind">Temp: ' + (json.temp || '') + '</div>' +
				// '<div class="weather-wind">Real: ' + (json.feelslike || '') + '</div>' +
				'<div class="weather-wind">Wind: ' + (json.wind || '') + '</div>' +
				'<div class="weather-wind">Humid: ' + (json.humidity || '') + '</div>' +
				'<div class="weather-wind">Press: ' + (json.pressure || '') + '</div>' +
			'</div>' +
			'<span class="weather-badge">' + (json.feelslike || '') + '</span>' +
			'<img class="weather-icon" src="../widgets/weather/' + theme + '/' + (json.code || 30) + '.png" />' +
		'</div>' +
		'<div class="weather-forecast"><table><tr>' + forecast + '</tr></table></div>';
}


function Widget (el, params, config) {
	this.el = el;
	this.size = params.size;
	this.config = Object.assign({ woeid: params.woeid || '560743' }, config || {});
	this.render();
}



Widget.prototype.render = function (data) {
	var newHtml = getHtml(data);
	if (this.oldHtml !== newHtml) this.el.innerHTML = this.oldHtml = newHtml;
};


Widget.prototype.tick = function () {
	weather(this.config.woeid)
		.then(this.render.bind(this))
		.catch(console.error.bind(console));
};


module.exports = Widget;



