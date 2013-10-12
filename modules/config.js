var fs = require('fs'), data = {};

exports.load = function(cb) {
	fs.readFile('config.json', function(err, str) {
		if (err) return cb(new Error('Cannot read config from disk. Check existence and file permissions of config.json at application root.'));
		try {
			data = JSON.parse(str);
		} catch(e) {
			return cb(new Error('Cannot parse config as JSON. Check config.json is valid JSON and restart.'));
		}
		cb(null);
	});
}

exports.get = function(key) {
	return data[key];
}
