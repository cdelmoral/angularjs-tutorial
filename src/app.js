var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var cors = require('cors');

var users = require(path.join(__dirname, '/users/users-route'));
var microposts = require(path.join(__dirname, '/microposts/micropost-routes'));
var sessions = require(path.join(__dirname, '/sessions/sessions-route'));
var passwordResets = require(path.join(__dirname, '/password-resets/password-resets-routes'));

var app = express();

var User = require(path.join(__dirname, '/users/user-model'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(cors());

app.use('/api', function(req, res, next) {
    var sess = req.session;
    if (sess.user_id) {
        User.getUserById(sess.user_id).then(function(user) {
            if (!user) {
                sess.user_id = null;
            }

            next();
        }).catch(function() {
            next();
        });
    } else {
        next();
    }
});

app.use('/api/users', users);
app.use('/api/microposts', microposts);
app.use('/api/sessions', sessions);
app.use('/api/password_resets', passwordResets);

module.exports = app;
