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
				error: function(err) { def.reject(err); }
			});
		}
	}
];

exports.get = function(callback) {
	var key, promiselist = [];
	deferred.map(checks, function(check) {
		var def = deferred();
		var def2 = deferred();
		check.func(def);
		setTimeout(function() { def.reject(new Error("Timeout: check did not complete within "+timeout+"ms")) }, timeout);
		def.promise.done(function() {
			def2.resolve(_.extend({}, _.pick(check, ['name', 'check']), {ok:true}))
		}, function(err) {
			def2.resolve(_.extend({}, _.pick(check, ['name', 'check', 'businessImpact', 'technicalImpact', 'panicGuide', 'severity']), {ok:false, checkOutput:err.output?JSON.stringify(err.output):err.toString()}));
		});
		return def2.promise;
	})(function(data) {
		callback(data);
	})
}
