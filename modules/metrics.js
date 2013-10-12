
var deferred = require('deferred'),
config = require('./config'),
_ = require('lodash'),
timeout = 1000;

var metrics = {
	twitterRespTime: {
		type: "count",
		unit: "seconds",
		func: function(def) {
			var req = require('request');
			var start = (new Date()).getTime();

			// This won't actually work as it's not authenticated but this metric simply wants to know the response time
			req.get('https://api.twitter.com/1.1/statuses/show.json?id=210462857140252672', function(err, resp, body) {
				var end = (new Date()).getTime();
				def.resolve(err ? null : (end-start)/1000);
			});
		}
	},
	memcacheRespTime: {
		type: "count",
		unit: "seconds",
		func: function(def) {
			var Memcached = require('memcached');
			var mcconfig = config.get('memcached');
			if (!mcconfig) {
				def.resolve(null);
			} else {
				var start = (new Date()).getTime();
				memcached = new Memcached(mcconfig.servers, mcconfig.options);
				memcached.get('test', function(err, data) {
					var end = (new Date()).getTime();
					def.resolve(err ? null : (end-start)/1000);
				});
			}
		}
	}
}

exports.get = function(callback) {
	var key, promiselist = [], data = {};
	for (key in metrics) {
		promiselist.push(function(_key) {
			var def = deferred();
			metrics[key].func(def);
			setTimeout(function() { def.resolve(null) }, timeout);
			def.promise.then(function(result) {
				if (typeof result !== 'object' || result === null) result = {val:result};
				data[_key] = _.extend({}, _.omit(metrics[_key], 'func'), result);
			});
			return def.promise;
		}(key));
	}
	deferred.apply(null, promiselist).then(function() {
		callback(data);
	});
}
