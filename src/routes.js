var express = require('express');
var router = express.Router();
var UsersController = require('./users/users-controller');
var MicropostsController = require('./microposts/microposts-controller');
var SessionsController = require('./sessions/sessions-controller');
var PasswordResetsController = require('./password-resets/password-resets-controller');
var requireLogin = require('./sessions/sessions-helper').requireLogin;
var requireCorrectUser = require('./sessions/sessions-helper').requireCorrectUser;

router.all('*', SessionsController.find);
router.param('user_id', UsersController.find);

router.get('/users/is_unique', UsersController.unique);
router.get('/users/index_page', requireLogin, UsersController.index);
router.get('/users/:user_id', requireLogin, UsersController.show);
router.post('/users/', UsersController.create);
router.put('/users/activate/:user_id/:token', UsersController.activate);
router.put('/users/:user_id', requireCorrectUser, UsersController.update);
router.delete('/users/:user_id', requireLogin, UsersController.destroy);

router.put('/users/new_micropost/:user_id', requireCorrectUser, UsersController.createMicropost);
router.delete('/users/:id/:micropost_id', requireCorrectUser, UsersController.deleteMicropost);

router.get('/microposts/user_page/:user_id', MicropostsController.getMicropostPageForUser);
router.get('/microposts/feed/:user_id/', requireCorrectUser, MicropostsController.getMicropostFeedPageForUser);
router.get('/microposts/count/:user_id', MicropostsController.getMicropostCountForUser);

router.get('/sessions/authenticated', SessionsController.isAuthenticated);
router.post('/sessions/', SessionsController.create);
router.delete('/sessions/logout', SessionsController.destroy);

router.get('/password_resets/valid_token', PasswordResetsController.validateToken);
router.post('password_resets/', PasswordResetsController.createPasswordReset);
router.put('password_resets/:id/:token', PasswordResetsController.updatePassword);

module.exports = router;
