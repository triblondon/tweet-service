
var twit, hbs, fs;

function init() {

	fs = require('fs');

	twit = new (require('twit'))({
		consumer_key: 'rNmjOs81JIGEOKz3Oat7Uw',
		consumer_secret: '9PYh4HPGFDpUVuCfMM7EEZTQCfZ28xPCmt1uIjCRxw',
		access_token: '490703854-bDfTS8X63eY1AzuEDQBbiJUBsjrBciHxzqijIQqo',
		access_token_secret: '3zIOm3bsHM8CxOOFOuifRivQ1qalApZJJZ4D0UqA'
	});


	/* Handlebars and template helpers */

	hbs = require('handlebars');

	hbs.registerHelper('ifEq', function(context, block) {
		return (context == block.hash.compare) ? block.fn(this) : block.inverse(this);
	});
	hbs.registerHelper('ifContains', function(context, block) {
		return (context.indexOf(block.hash.compare) != -1) ? block.fn(this) : block.inverse(this);
	});
	hbs.registerHelper('numberFormat', function(value) {
	    return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	});
	hbs.registerHelper('dateFormat', function(context, block) {
		moment = require('moment');
		return moment(Date(context)).format(block.hash.format);
	});
	hbs.registerHelper('autoLink', function(value, block) {
		var escaped = hbs.Utils.escapeExpression(value);
		var pattern = /\b((?:https?|ftp|file):\/\/)([-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|])/ig;
		return new hbs.SafeString(escaped.replace(pattern, "<a href='$&'>$2</a>"));
	});
	hbs.registerHelper('extract', function(value, block) {
		if (block.hash.type == 'youtube') return value.replace(/^.*watch\?v=([^&]+).*$/i, '$1');
	});
}

module.exports = {
	statuses: {
		show: function(params) {
			var m;
			if (m = params.id.toString().match(/^(?:https?\:\/\/)?(?:www\.)?twitter\.com\/[^\/]+\/status(?:es)?\/([^\/]+)\/?$/)) {
				params.id = m[1];
			}
		 	if (params.id.toString().search(/^\d+$/) === -1) throw "Required id not specified or not recognised";

			if (!twit) init();
			twit.get('statuses/show/:id', {id:params.id}, function(err, res) {
				if (!err && params.success) {
					if (params.format && params.format === 'json') {
						params.success({
							id: res.id_str,
							created_at: res.created_at,
							text: res.text,
							user: {
								id: res.user.id,
								name: res.user.name,
								screen_name: res.user.screen_name,
								profile_image_url_https: res.user.profile_image_url_https
							},
							entities: res.entities
						});
					} else {
						var template = hbs.compile(fs.readFileSync('views/tweet.html').toString());
						params.success(template(res));
					}
				} else {
					if (params.error) params.error(err);
				}
			});
		}
	}
}
