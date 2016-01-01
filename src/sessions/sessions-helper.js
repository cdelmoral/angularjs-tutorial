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

module.exports = SessionHelper;
