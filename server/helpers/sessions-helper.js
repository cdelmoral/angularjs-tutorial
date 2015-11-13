exports.requireLogin = requireLogin;
exports.requireCorrectUser = requireCorrectUser;

/** Checks that the user is logged in. */
function requireLogin(req, res, next) {
    var sess = req.session;

    console.log('sessions-helper.js 8');
    console.log(sess);
    if (sess.user && sess.user._id) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

/** Checks that the request for a user resource comes from that user. */
function requireCorrectUser(req, res, next) {
    var sess = req.session;
	requireLogin(req, res, function() {
		if (req.params.id == sess.user._id) {
			next();
		} else {
			res.status(401).send('Unauthorized');
		}
	});
}
