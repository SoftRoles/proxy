var express = require('express');
var assert = require('assert');

var passport = require('passport');
var passStrategyLocal = require('passport-local').Strategy;

var session = require('express-session');
var mongodbSessionStore = require('connect-mongodb-session')(session);
var proxy = require('http-proxy-middleware');

var mongodb;
var mongoClient = require("mongodb").MongoClient
var mongodbUrl = "mongodb://127.0.0.1:27017"
mongoClient.connect(mongodbUrl, { poolSize: 10 }, function (err, client) {
	assert.equal(null, err);
	mongodb = client;
});

// Create a new Express application.
var app = express();

var store = new mongodbSessionStore({
	uri: mongodbUrl,
	databaseName: 'auth',
	collection: 'sessions'
});

// Catch errors
store.on('error', function (error) {
	assert.ifError(error);
	assert.ok(false);
});

app.use(require('express-session')({
	secret: 'This is a secret',
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
	},
	store: store,
	resave: true,
	saveUninitialized: true
}));


app.use(require("body-parser").json())
app.use(require("body-parser").urlencoded({ extended: true }))
app.use(require("cors")())
app.use(require('morgan')('tiny'));
app.use("/login/bower_components", express.static(__dirname + "/public/bower_components"))

passport.use(new passStrategyLocal(function (username, password, cb) {
	mongodb.db("auth").collection("users").findOne({ username: username, password: password }, function (err, user) {
		if (err) return cb(err)
		if (!user) { return cb(null, false); }
		return cb(null, user);
	});
}));
passport.serializeUser(function (user, cb) {
	cb(null, user.username);
});
passport.deserializeUser(function (username, cb) {
	mongodb.db("auth").collection("users").findOne({ username: username }, function (err, user) {
		if (err) return cb(err)
		if (!user) { return cb(null, false); }
		return cb(null, user);
	});
});
app.use(passport.initialize());
app.use(passport.session());
app.use('/app2', proxy({
	target: 'http://127.0.0.1:2991', changeOrigin: true, onProxyReq: (proxyReq, req) => {
		if(req.user) proxyReq.setHeader("Authorization", "Bearer "+ req.user.token);
	}
}));

app.get("/app1", function (req, res) {
	console.log(req.isAuthenticated())
	console.log(req.user)
	res.send("Hello")
})


app.get('/login', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function (req, res) {
	res.redirect(req.query.source);
});

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/login');
});


app.get('/user', function (req, res) {
	if (req.user) {
		mongodb.db("auth").collection("users").findOne({ token: req.user.token }, function (err, user) {
			if (err) res.send(err)
			else res.send(user)
		});
	}
	else res.send({})
});

app.listen(2990, function () {
	console.log("Service 3007-login running on http://127.0.0.1:2990")
})