var request = require('request-promise');
var rootUrl = 'https://www.inoreader.com';
var apiUrl = rootUrl + '/reader/api/0';
var config = {
	appId: 1111111111,
	appKey: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
	appName: 'myapp-name',
	token: '',
	login: '',
	pass: ''
};


function getRequest (url, data) {
	var h = {
		uri: url,
		method: 'POST',
		headers: {
			AppId: config.appId,
			AppKey: config.appKey,
			'User-Agent': config.appName
		}
	};
	if (config.token) h.headers.Authorization = 'GoogleLogin auth=' + config.token;
	if (data) h.form = data;
	return request(h);
}

function _login () {
	var url = rootUrl + '/accounts/ClientLogin';
	var data = { Email: config.login, Passwd: config.pass };
	return getRequest(url, data)
		.then(function (body) {
			config.token = body.split('\n')[2].split('=')[1];
			return config.token;
		});
}


function _getCounters () {
	return getRequest(apiUrl + '/unread-count')
		.then(function (resp) {
			return JSON.parse(resp).unreadcounts;
		});
}

function _getTotalCount (counters) {
	if (!counters || !counters.length) return Promise.reject('Parse error!');
	return Promise.resolve(counters[0].count);
}

module.exports = {
	config: function (cfg) { config = cfg || config; return Promise.resolve(); },
	getCounters: function () { return _login().then(_getCounters); },
	getTotalCount: function () { return _login().then(_getCounters).then(_getTotalCount); }
};
