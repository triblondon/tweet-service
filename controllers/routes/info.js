
module.exports = function(req, res) {
	var template = require('handlebars').compile(fs.readFileSync('views/info.html').toString());
	res.send(template(temData));
}
