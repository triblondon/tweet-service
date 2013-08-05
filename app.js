var express = require('express');

var app = express()
.use(express.static('public'))
.set('view engine', 'html')

app.get('/', require('./controllers/routes/info.js'));
app.get('/v1/statuses/show.:format', require('./controllers/routes/statuses.show.js'));

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.send(500, err);
});

app.listen(3000);
