var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');

var users = require(path.join(__dirname, '/routes/users'));
var sessions = require(path.join(__dirname, '/routes/sessions'));

var app = express();

var User = require(path.join(__dirname, '/user/user-model'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use('/api', function(req, res, next) {
    var sess = req.session;
    if (sess && sess.user) {
        User.findById(sess.user._id, 'name email _id', function(err, user) {
            if (user && user._id) {
                sess.user = user;
            }
            next();
        });
    } else {
        next();
    }
});

app.use('/api/users', users);
app.use('/api/sessions', sessions);

module.exports = app;
