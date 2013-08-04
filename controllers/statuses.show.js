
var Twit = require('twit');

module.exports = function(req, res) {
	var twid, twit;
	if (req.query.id) {
		if (req.query.id.search(/^\d+$/) !== -1) {
			twid = req.query.id;
		} else if (m = req.query.id.match(/^(?:https?\:\/\/)?(?:www\.)?twitter\.com\/[^\/]+\/status(?:es)?\/([^\/]+)\/?$/)) {
			twid = m[1];
		}
	}
	if (!twid) throw('No valid twitter status id specified');

	twit = new Twit({
		consumer_key: 'rNmjOs81JIGEOKz3Oat7Uw',
		consumer_secret: '9PYh4HPGFDpUVuCfMM7EEZTQCfZ28xPCmt1uIjCRxw',
		access_token: '490703854-bDfTS8X63eY1AzuEDQBbiJUBsjrBciHxzqijIQqo',
		access_token_secret: '3zIOm3bsHM8CxOOFOuifRivQ1qalApZJJZ4D0UqA'
	});
	twit.get('statuses/show/:id', {id:twid}, function(twErr, twRes) {
		if (!twErr) {
			if (req.params.format && req.params.format === 'json') {
				res.send(twRes);
			} else {
				res.render('tweet.html', twRes);
			}
		} else {
			res.send(twErr);
		}
	});
}
