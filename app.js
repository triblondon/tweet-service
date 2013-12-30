var express = require('express');
var config = require('./modules/config');

var app = express()

// Serve files statically from the /public directory
.use(express.static('public'))
.set('view engine', 'html')

// Origami-advised CORS response headers allowing access from browser
app.all('*', function(req, res, next){
  if (!req.get('Origin')) return next();
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

// Origami-required docs and monitoring
app.get('/', require('./controllers/standard/info'));
app.get('/v:version', require('./controllers/standard/info'));
app.get('/__about', require('./controllers/standard/about'));
app.get('/v:version/__about', require('./controllers/standard/about'));
app.get('/__metrics', require('./controllers/standard/metrics'));
app.get('/v:version/__metrics', require('./controllers/standard/metrics'));
app.get('/__health', require('./controllers/standard/health'));
app.get('/v:version/__health', require('./controllers/standard/health'));

// Origami-required source identifier (applies to all API endpoints, below, but not monitoring and docs endpoints, above)
app.all('/v:version/*', function(req, res, next) {
	if (!req.query.source && !req.get('X-FT-Source')) {
		res.send(400, 'Please specify a source identifier');
	} else {
		req.source = req.query.source || req.get('X-FT-Source');
		next();
	}
})

// API endpoints
app.get('/v1/statuses/show.:format', require('./controllers/statuses.show'));

// 404 handler for any other requests not handled above
app.get('*', function(req, res){
  res.send(404, "404 - Not found");
});

// Error handing
app.use(function(err, req, res, next) {
	if (err.stack) console.error(err.stack);
	res.send(500, req.query.showerrors ? err : '');
});

// Load config and launch server
config.load(function(err) {
	if (err) {
		console.log(err.toString());
		process.exit(1);
	} else {
		app.listen(config.get('port'));
		console.log('Listening on port '+config.get('port'));
	}
});
