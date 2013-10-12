
var twit, Mustache, fs;

function init() {
	var config = require('./config');

	fs = require('fs');
	twit = new (require('twit'))(config.get('twit'));

	Mustache = require('mustache');
}

function dateFormat(str, format) {
	var moment = require('moment');
	return moment(Date(str)).format(format);
}

function autoLink(str) {
	var pattern = /\b((?:https?|ftp|file):\/\/)([-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|])/ig;
	return str.replace(pattern, "<a href='$&'>$2</a>");
}

function numberFormat(value) {
    return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

function trim(str) {
	return str.replace(/^\s+/, '').replace(/\s+$/, '');
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
				var data;
				if (!err && params.success) {
					data = {
						id: res.id_str,
						created_at: res.created_at,
						created_at_formatted: dateFormat(res.created_at, 'h:mma, Do MMM YYYY'),
						text: trim(res.text),
						html: autoLink(trim(res.text)),
						user: {
							id: res.user.id,
							name: res.user.name,
							screen_name: res.user.screen_name,
							profile_image_url_https: res.user.profile_image_url_https
						},
						photos: [],
						youtube_vids: [],
						favorite_count: numberFormat(res.favorite_count),
						retweet_count: numberFormat(res.retweet_count)
					}

					// Transform media
					if (res.entities.media) {
						res.entities.media.forEach(function(item) {
							if (item.type == 'photo') {
								data.photos.push({
									media_url_https: item.media_url_https,
									url: item.url,
									display_url: item.display_url
								})
							}
						});
					}

					if (params.format && params.format === 'json') {
						params.success(data);
					} else {
						var template = Mustache.compile(fs.readFileSync('bower_components/tweet-module/main.ms').toString());
						params.success(template(data));
					}
				} else {
					if (params.error) params.error(err);
				}
			});
		}
	}
}
