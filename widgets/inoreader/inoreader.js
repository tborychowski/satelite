'use strict';

const request = require('request-promise');
const rootUrl = 'https://www.inoreader.com';
const apiUrl = rootUrl + '/reader/api/0';
let config = {
	appId: 1111111111,
	appKey: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
	appName: 'myapp-name',
	token: '',
	login: '',
	pass: ''
};

function getRequest (url, data) {
	let h = {
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
	let url = rootUrl + '/accounts/ClientLogin';
	let data = { Email: config.login, Passwd: config.pass };
	return getRequest(url, data).then((body) => config.token = body.split('\n')[2].split('=')[1]);
}


function _getCounters () {
	return getRequest(apiUrl + '/unread-count').then((resp) => JSON.parse(resp).unreadcounts);
}

function _getTotalCount (counters) {
	if (!counters || !counters.length) return Promise.reject('Parse error!');
	return Promise.resolve(counters[0].count);
}

module.exports = {
	config: (cfg) => Promise.resolve(config = cfg || config),
	getCounters: () => _login().then(_getCounters),
	getTotalCount: () => _login().then(_getCounters).then(_getTotalCount)
};
