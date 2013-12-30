var deferred = require('deferred'),
_ = require('lodash'),
timeout = 1000;

var checks = [
	{
		name: "Twitter API",
		businessImpact: "The tweet service won't work. Tweets may not appear on sites that rely on the tweet service, though since most will likely be cached, the most likely impact is that embedding new tweets will not work.",
		technicalSummary: "Retrieves a tweet from Twitter's statuses.show API",
		panicGuide: "If it's because we've hit our rate limit, the only immediate option is to contact Twitter and ask for an increased limit.",
		severity: 3,
		func: function(def) {
			require('./twitterapi.js').statuses.show({
				id: '210462857140252672',
				format: 'json',
				success: function() { def.resolve(true); },
				error: function(msg) { def.reject(msg); }
			});
		}
	}
];

exports.get = function(callback) {
	var key, promiselist = [], data = [];
	deferred.map(checks, function(check) {
		var def = deferred();
		check.func(def);
		setTimeout(function() { def.reject(new Error("Timeout: check did not complete within "+timeout+"ms")) }, timeout);
		def.promise.done(function() {
			data.push(_.extend({}, _.pick(check, ['name', 'check']), {ok:true}));
		}, function(msg) {
			data.push(_.extend({}, _.pick(check, ['name', 'check', 'businessImpact', 'technicalImpact', 'panicGuide', 'severity']), {ok:false, checkOutput:JSON.stringify(msg)}));
		});
		return def.promise;
	}).finally(function() {
		callback(data);
	})
}
