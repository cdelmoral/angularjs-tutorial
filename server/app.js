var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
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

if (process.env.NODE_ENV === 'development') {
    app.use('/bower_components', express.static(path.join(__dirname, '../../angularjs-tutorial-ui/bower_components')));
    app.use(express.static(path.join(__dirname, '../../angularjs-tutorial-ui/.dev')));
}

app.use('/api/users', users);
app.use('/api/sessions', sessions);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

mongoose.connect('mongodb://localhost/angularjs_tutorial', function(err) {
    if (err) {
        console.log('Database connection error', err);
    } else {
        console.log('Connection to database successful');
    }
});

module.exports = app;
