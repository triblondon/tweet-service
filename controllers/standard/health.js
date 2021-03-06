
var health = require('../../modules/health');

module.exports = function(req, res, next) {

	// Display current version healthcheck if no version is specified
	if (!req.params.version || req.params.version == 1) {
		health.get(function(data) {
			res.set('Cache-control', 'max-age=0, no-cache, must-revalidate');
			res.jsonp({
				schemaVersion: 1,
				name: 'tweet-service',
				description: 'Retrieves tweets from Twitter, formats and outputs them using FT preferred HTML markup',
				checks: data
			});
		});
	} else {
		next();
	}
}
