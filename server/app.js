var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var sessions = require('./routes/sessions');

var app = express();

var User = require('./user/user-model.js');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: 'notasecuresecret',
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
