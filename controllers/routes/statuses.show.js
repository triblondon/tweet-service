
module.exports = function(req, res) {
	var format;
	if (!req.query.id) throw('No twitter status id specified');

	format = req.params.format.match(/^html|json$/) ? req.params.format : 'html';
	require('../sources/twitterapi.js').statuses.show({
		id: req.query.id,
		format: req.params.format || 'html',
		success: function(op) {
			res.set('Cache-control', 'max-age=3600, public');
			if (format == 'json') {
				res.jsonp(op);
			} else {
				res.send(op);
			}
		},
		error: function(msg) {
			res.send(msg, 500);
		}
	});
}
