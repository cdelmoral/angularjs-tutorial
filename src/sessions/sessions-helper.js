exports.requireLogin = requireLogin;
exports.requireCorrectUser = requireCorrectUser;

/** Checks that the user is logged in. */
function requireLogin(req, res, next) {
    var sess = req.session;
    if (sess.user_id) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

/** Checks that the request for a user resource comes from that user. */
function requireCorrectUser(req, res, next) {
    var sess = req.session;
    var id = req.params.id || req.params.userId;
    
	requireLogin(req, res, function() {
		if (id == sess.user_id) {
			next();
		} else {
			res.status(403).send('Forbidden');
		}
	});
}
