
module.exports = function(req, res, next) {

	// Display current version metrics if no version is specified
	if (!req.params.version || req.params.version == 1) {
		res.set('Cache-control', 'max-age=0, no-cache, must-revalidate');
		res.jsonp({
			schemaVersion: 1,
			metrics: {
				memcacheReachable: {
					type: "boolean",
					val: TODO
				},
				twitterReachable: {
					type: 'boolean',
					val: TODO
				}
			}
		});
	} else {
		next();
	}
}
