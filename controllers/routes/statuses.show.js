
module.exports = function(req, res) {
	if (!req.query.id) throw('No twitter status id specified');

	require('../sources/twitterapi.js').statuses.show({
		id: req.query.id,
		format: req.params.format || 'html',
		success: function(op) {
			res.send(op);
		},
		error: function(msg) {
			res.send(msg, 500);
		}
	});
}
