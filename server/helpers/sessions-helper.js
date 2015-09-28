exports.requireLogin = requireLogin;

function requireLogin(req, res, next) {
    var sess = req.session;
    if (sess.user && sess.user._id) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}
