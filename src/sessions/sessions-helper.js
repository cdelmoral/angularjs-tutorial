var User = require('../users/user-model');

var SessionHelper = function() {};

SessionHelper.currentUser = null;

SessionHelper.requireLogin = function(req, res, next) {
    var sess = req.session;
    var currentUser = SessionHelper.currentUser;

    if (currentUser) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

SessionHelper.requireCorrectUser = function(req, res, next) {
    var sess = req.session;
    
    SessionHelper.requireLogin(req, res, function() {
        if (SessionHelper.currentUser.id === sess.user_id) {
            next();
        } else {
            res.status(403).send('Forbidden');
        }
    });
};

SessionHelper.checkSession = function(req, res, next) {
    var sess = req.session;
    if (sess.user_id) {
        User.getUserById(sess.user_id).then(function(user) {
            if (!user) {
                sess.user_id = null;
            } else {
                SessionHelper.currentUser = user;
            }

            next();
        }).catch(function() {
            next();
        });
    } else {
        next();
    }
};

module.exports = SessionHelper;
