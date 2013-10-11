var express = require('express');
var app = express()

// Serve files statically from the /public directory
.use(express.static('public'))
.set('view engine', 'html')

// Origami-required source identifier
app.all('*', function(req, res, next) {
	if (!req.query.source && !req.get('X-FT-Source')) {
		res.send(400, 'Please specify a source identifier');
	} else {
		req.source = req.query.source || req.get('X-FT-Source');
		next();
	}
})

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
app.get('/', require('./controllers/routes/info.js'));
app.get('/v:version', require('./controllers/routes/info.js'));
app.get('/about', require('./controllers/routes/about.js'));
app.get('/v:version/about', require('./controllers/routes/about.js'));
app.get('/metrics', require('./controllers/routes/metrics.js'));
app.get('/v:version/metrics', require('./controllers/routes/metrics.js'));
app.get('/health', require('./controllers/routes/health.js'));
app.get('/v:version/health', require('./controllers/routes/health.js'));

// API endpoints
app.get('/v1/statuses/show.:format', require('./controllers/routes/statuses.show.js'));

// 404 handler for any other requests not handled above
app.get('*', function(req, res){
  res.send(404, "404 - Not found");
});

// Error handing
app.use(function(err, req, res, next) {
	if (err.stack) console.error(err.stack);
	res.send(500, err);
});

app.listen(3000);
