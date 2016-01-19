var express = require('express');
var router = express.Router();
var User = require('./users/user-model');
var UsersController = require('./users/users-controller');
var MicropostsController = require('./microposts/microposts-controller');
var SessionsController = require('./sessions/sessions-controller');
var UserNotFoundException = require('./users/user-not-found-exception');
var requireLogin = require('./sessions/sessions-helper').requireLogin;
var requireCorrectUser = require('./sessions/sessions-helper').requireCorrectUser;

router.all('*', SessionsController.findUserSession);
router.param('user_id', UsersController.findUser);

router.get('/users/is_unique', UsersController.isUnique);
router.get('/users/index_page', requireLogin, UsersController.index);
router.get('/users/:user_id', requireLogin, UsersController.show);
router.post('/users/', UsersController.createUser);
router.put('/users/activate/:user_id/:token', UsersController.activate);
router.put('/users/:user_id', requireCorrectUser, UsersController.update);
router.put('/users/new_micropost/:user_id', requireCorrectUser, UsersController.createMicropost);
router.delete('/users/:id', requireLogin, UsersController.deleteUser);
router.delete('/users/:id/:micropost_id', requireCorrectUser, UsersController.deleteMicropost);

router.get('/microposts/user_page/:user_id', MicropostsController.getMicropostPageForUser);
router.get('/microposts/feed/:user_id/', requireCorrectUser, MicropostsController.getMicropostFeedPageForUser);
router.get('/microposts/count/:user_id', MicropostsController.getMicropostCountForUser);

router.get('/sessions/authenticated', SessionsController.isAuthenticated);
router.post('/sessions/', SessionsController.authenticateUser);
router.delete('/sessions/logout', SessionsController.endSession);

module.exports = router;
