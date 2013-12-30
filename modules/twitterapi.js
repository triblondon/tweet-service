
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

function linkURLs(str, urls) {
	urls.forEach(function(url) {
		str = str.replace(url.url, "<a href='"+url.expanded_url+"'>"+url.display_url+"</a>");
	})
	return str;
}

function linkUsers(str, mentions) {
	mentions.forEach(function(mention) {
		str = str.replace('@'+mention.screen_name, "<a href='http://twitter.com/"+mention.screen_name+"' title='"+mention.name+"'>@"+mention.screen_name+"</a>");
	});
	return str;
}

function linkHashTags(str, tags) {
	tags.forEach(function(tag) {
		str = str.replace('#'+tag.text, "<a href='https://twitter.com/search?q=%23"+tag.text+"&amp;src=hash'>#"+tag.text+"</a>");
	});
	return str;
}

function numberFormat(value) {
    return value ? value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") : null;
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
						html: trim(res.text),
						user: {
							id: res.user.id,
							name: res.user.name,
							screen_name: res.user.screen_name,
							profile_image_url_https: res.user.profile_image_url_https
						},
						photos: [],
						youtube: [],
						vimeo: [],
						favorite_count: numberFormat(res.favorite_count),
						retweet_count: numberFormat(res.retweet_count)
					}
					if (res.entities.user_mentions) {
						data.html = linkUsers(data.html, res.entities.user_mentions);
					}
					if (res.entities.hashtags) {
						data.html = linkHashTags(data.html, res.entities.hashtags);
					}
					if (res.entities.urls) {
						data.html = linkURLs(data.html, res.entities.urls);
					}

					// Transform media
					if (res.entities.media) {
						res.entities.media.forEach(function(item) {
							if (item.type == 'photo') data.photos.push(item.media_url_https);
						});
					}
					if (res.entities.urls) {
						res.entities.urls.forEach(function(url) {
							var vimeo = url.expanded_url.match(/vimeo\.com\/(\d+)/i);
							if (vimeo) data.vimeo.push(vimeo[1]);
							var youtube = url.expanded_url.match(/youtube\.com\/watch\/?\?v=(\w+)/i);
							if (youtube) data.youtube.push(youtube[1]);
						});
					}

					if (params.format && params.format === 'json') {
						params.success(data);
					} else {
						var template = fs.readFileSync('bower_components/o-tweet/main.mustache').toString();
						params.success(Mustache.render(template,data));
					}
				} else {
					if (params.error) params.error(err);
				}
			});
		}
	}
}
