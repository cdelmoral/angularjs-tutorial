var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));
  app.use(express.static(path.join(__dirname, '../.dev')));
}

app.use('/users', users);
app.use('/api/users', users);
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
