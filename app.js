var express = require('express');

var app = express();

var work = [
	{
		"name": "Foo",
		"visible": [1,3]
	},
	{
		"name": "Bar",
		"visible": [2]
	}
];

function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
}

app.configure(function () {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'this is a secret' }));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.get('/my_secret_page', checkAuth, function (req, res) {
  res.send('if you are viewing this page it means you are logged in');
});

app.get('/login', function (req, res) {
	res.render('home');
});

app.post('/login', function (req, res) {
  var post = req.body;
  if (post.user == 'marc' && post.password == 'test') {
    req.session.user_id = post.user;
    res.redirect('/my_secret_page');
  } else {
    res.send('Bad user/pass');
  }
});

app.get('/logout', function (req, res) {
  delete req.session.user_id;
  res.redirect('/login');
});

/////////////////////
app.get('/name/:name', function (req, res) {
	req.session.name = req.params.name;
	res.send('<a href="/name">Name</a>');
	// res.cookie('name', req.params.name).send('<a href="/name">Name</a>');
});
app.get('/name', function (req, res) {
	// res.send(req.cookies.name);
	res.send(req.session.name);
});
/////////////////////

/////////////////////
app.get('/work/settings', function (req, res) {
	res.send('work/settings');
});
app.get('/api/work', function (req, res) {
	res.send('API:Work');
});
/////////////////////

app.listen(app.get('port'));