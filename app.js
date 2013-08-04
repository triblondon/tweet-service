var express = require('express');
var hbs = require('hbs');

var app = express()
.use(express.static('public'))
.set('view engine', 'html')
.engine('html', hbs.__express);


app.get('/', function(req, resp) {
	resp.render("info");
});

app.get('/v1/statuses/show.:format', require('./controllers/statuses.show.js'));

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.send(500, err);
});

app.listen(3000);


/* Handlebars template helpers */

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
