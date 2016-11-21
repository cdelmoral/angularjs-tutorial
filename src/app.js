var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var cors = require('cors');

var routes = require(path.join(__dirname, '/routes'));

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 86400000
  }
}));

app.use(cors({origin: process.env.CLIENT_HOST, credentials: true}));

app.use('/api', routes);

module.exports = app;
