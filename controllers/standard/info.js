
module.exports = function(req, res, next) {

	// Redirect to current version if no version is specified
	if (!req.params.version) {
		res.redirect('/v1/');
	} else if (req.params.version == 1) {
		res.set('Cache-control', 'max-age=3600, public');
		res.sendfile('views/info.html');
	} else {
		next();
	}
}
