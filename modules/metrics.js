
var loaded = false,
metrics = {},
deferred = require('deferred'),
config = require('./config'),
_ = require('lodash');

metrics = {
	twitterReachable: {
		type: "boolean",
		func: function(def) {
			var req = require('request');
			req({
				uri:'https://api.twitter.com/1.1/statuses/show.json?id=210462857140252672',
				timeout: 500
			}, function(err, resp, body) {
				def.resolve(err ? {val:false} : {val:true});
			});
		}
	},
	memcacheReachable: {
		type: "boolean",
		func: function(def) {
			var mcconfig = config.get('memcached');
			var Memcached = require('memcached');
			if (!mcconfig) {
				def.resolve(undefined);
			} else {
				memcached = new Memcached(mcconfig.servers, mcconfig.options);
				memcached.items(function(err, data) {
					def.resolve(err ? false : true);
				});
			}
		}
	}
}

function load() {
	var i, promiselist = [];
	if (loaded) return deferred().resolve(metrics);
	for (i in metrics) {
		def = deferred();
		metrics[i].func(def);
		promiselist.push(def.promise);
		def.promise(function(result) {
			metrics[i] = _.extend({type: metrics[i].type}, result);
			if (typeof result !== 'object') result = {val:result};
			console.log('adding result', i, result);
		})
	}

	// TODO: This doesn't work!   How do you group promises?
	return deferred(promiselist)(function(result) {
		loaded = true;
		console.log('Metrics loaded', result);
	});
}

exports.get = function(key, callback) {
	load()(function(result) {
		console.log('get', result);
	})
}
