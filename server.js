var express = require('express');
var app = express();

var chance = require('chance')();

var sharejs = require('share');

var redis;
if(process.env.REDISTOGO_URL) {
	var url = require('url').parse(process.env.REDISTOGO_URL);
	redis = require('redis').createClient(url.port, url.hostname);
	redis.auth(url.auth.split(':')[1]);
} else {
	redis = require('redis').createClient();
}

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/:id', function(req, res) {
	res.render('pad');
});

app.get('/newpad', function(req, res) {
	var pad = newPad();
	res.redirect('/' + pad);
});

var newPad = function() {
	var pad = chance.hash({length: 25});
	while(redis.exists('ShareJS:doc:' + pad) == 1) {
		pad = chance.hash({length: 25});
	}
	return pad;
}

var options = {
	db: {
		type: 'redis',
		client: redis
	},
};
sharejs.server.attach(app, options);

var port = process.env.PORT || 8000;
app.listen(port);
