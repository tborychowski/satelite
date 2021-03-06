'use strict';

const Imap = require('imap');

var imap, successResult = {};


function init (config) {
	if (imap) return;
	imap = new Imap({
		host: 'imap.gmail.com',
		port: 993,
		tls: true,
		tlsOptions: { rejectUnauthorized: false },
		user: config.login,
		password: config.pass
	});
	imap.once('error', function (err) {
		console.error('gmail:', err);
	});
	// imap.once('end', function () { console.log('Connection ended'); });
}


function onSearch (resolve, reject) {
	let msgs = {}, fetch;
	return (err, results) => {
		if (!results || !results.length) {
			imap.end();
			successResult.msg = 'You have no unread messages!';
			return resolve(successResult);
		}

		fetch = imap.fetch(results, { bodies: '' });
		// var f = imap.seq.fetch('1:3', { bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)', struct: true });
		fetch.on('message', (msg, seqno) => {
			successResult.unread ++;

			// var prefix = '(#' + seqno + ') ';
			msg.on('body', (stream) => {
				let buffer = '';
				stream.on('data', (chunk) => { buffer += chunk.toString('utf8'); });
				stream.once('end', () => {
					let header = Imap.parseHeader(buffer);
					// msgs['msg' + seqno] = header.subject + ' (from: ' + header.from + ')';
					msgs['msg' + seqno] = header.subject;
				});
			});
			// msg.once('attributes', function (attrs) { console.log(prefix + 'Attributes: %s', attrs); });
			// msg.once('end', function () { console.log(prefix + 'Finished'); });
		});
		fetch.once('error', reject);
		fetch.once('end', () => {
			imap.end();
			let messages = [], m, count = 0;
			for (m in msgs) { messages.push(msgs[m]); count++; }
			successResult.messages = messages;
			successResult.msg = 'You have ' + count + ' unread message' + (count > 1 ? 's' : '') + '!';

			resolve(successResult);
		});
	};
}


function check (config) {
	init(config);
	successResult = {};
	let thisY = (new Date()).getFullYear();

	return new Promise((resolve, reject) => {
		imap.once('ready', () => {
			imap.openBox('INBOX', true, (err, box) => {
				if (err) return reject(err);
				successResult = box.messages;
				successResult.unread = 0;
				imap.search([ 'UNSEEN', ['SINCE', thisY ] ], onSearch(resolve, reject));
			});
		});
		imap.connect();
	});
}

module.exports = {
	check: check
};
