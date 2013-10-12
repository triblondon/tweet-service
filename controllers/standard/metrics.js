
var metrics = require('../../modules/metrics');

module.exports = function(req, res, next) {

	// Display current version metrics if no version is specified
	if (!req.params.version || req.params.version == 1) {
		metrics.get(function(data) {
			res.set('Cache-control', 'max-age=0, no-cache, must-revalidate');
			res.jsonp({
				schemaVersion: 1,
				metrics: data
			});
		})
	} else {
		next();
	}
}
