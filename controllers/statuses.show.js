
module.exports = function(req, res) {
	var format, mckey,
	deferred = require('deferred'),
	Memcached = require('memcached'),
	mcconfig = require('../modules/config').get('memcached');

	if (!req.query.id) throw('No twitter status id specified');

	format = req.params.format.match(/^html|json$/) ? req.params.format : 'html';
	mckey = 'origami-tweet-'+req.query.id+'-'+format;

	def = deferred();
	memcached = new Memcached(mcconfig.servers, mcconfig.options);
	memcached.get(mckey, function(err, cacheres) {
		if (cacheres) {
			def.resolve(cacheres);
		} else {
			require('../modules/twitterapi.js').statuses.show({
				id: req.query.id,
				format: format,
				success: function(op) {
					memcached.set(mckey, op, 3600, function() {});
					def.resolve(op);
				},
				error: function(msg) {
					res.send(500, msg);
				}
			});
		}
	});

	def.promise(function(op) {
		res.set('Cache-control', 'max-age=3600, public');
		if (format == 'json') {
			res.jsonp(op);
		} else {
			res.send(op);
		}
	});
}
