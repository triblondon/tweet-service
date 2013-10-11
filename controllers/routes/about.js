
module.exports = function(req, res, next) {
	if (req.params.version && req.params.version == 1) {
		res.jsonp({
			name: "tweet-service",
			apiVersion: 1,
			appVersion: "TODO - how to get app version?  Deployment question.",
			dateCreated: "2013-10-10",
			docs: "http://tweet.webservices.ft.com/",
			support: "andrew.betts@ft.com",
			supportStatus: "active"
		});
	} else if (!req.params.version) {
		res.jsonp({
			name: "tweet-service",
			versions: [
				"http://tweet.webservices.ft.com/v1"
			]
		});
	} else {
		next();
	}
}
