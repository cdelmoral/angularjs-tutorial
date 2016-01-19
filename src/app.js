var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var cors = require('cors');

var routes = require(path.join(__dirname, '/routes'));
var passwordResets = require(path.join(__dirname, '/password-resets/password-resets-routes'));

var SessionHelper = require(path.join(__dirname, '/sessions/sessions-helper'));

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(cors());

app.use('/api', routes);
app.use('/api/password_resets', passwordResets);

module.exports = app;
