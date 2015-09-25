exports.requireLogin = function(req, res, next) {
    var sess = req.session;
    if (!sess.user_id) {
        res.status(401).send('Unauthorized');
    } else {
        next();
    }
};
