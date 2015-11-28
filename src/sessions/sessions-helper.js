exports.requireLogin = requireLogin;
exports.requireCorrectUser = requireCorrectUser;
exports.createSessionForUser = createSessionForUser;

/** Checks that the user is logged in. */
function requireLogin(req, res, next) {
    var sess = req.session;
    
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

function createSessionForUser(user, session) {
    session.user = { name: user.name, email: user.email, _id: user._id, admin: user.admin };
    return { name: user.name, email: user.email, id: user._id, admin: user.admin };
}
