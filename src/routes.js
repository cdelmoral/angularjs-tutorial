var express = require('express');
var router = express.Router();

var UsersController = require('./users/users-controller');
var MicropostsController = require('./microposts/microposts-controller');
var SessionsController = require('./sessions/sessions-controller');
var PasswordResetsController = require('./password-resets/password-resets-controller');
var RelationshipsController = require('./users/relationships-controller');

var loggedIn = require('./sessions/sessions-helper').loggedIn;
var correctUser = require('./sessions/sessions-helper').correctUser;

router.all('*', SessionsController.find);
router.param('user_id', UsersController.find);
router.param('micropost_id', MicropostsController.find);

router.get('/users/is_unique', UsersController.unique);
router.get('/users/index_page', loggedIn, UsersController.index);
router.get('/users/:user_id', loggedIn, UsersController.show);
router.get('/users/:user_id/following', loggedIn, UsersController.following);
router.get('/users/:user_id/followers', loggedIn, UsersController.followers);
router.post('/users/', UsersController.create);
router.post('/users/:user_id/follow', loggedIn, RelationshipsController.create);
router.put('/users/activate/:user_id/:token', UsersController.activate);
router.put('/users/:user_id', correctUser, UsersController.update);
router.delete('/users/:user_id', loggedIn, UsersController.destroy);
router.delete('/users/:user_id/unfollow', loggedIn, RelationshipsController.destroy);

router.post('/users/:user_id/microposts', correctUser, MicropostsController.create);
router.delete('/users/:user_id/microposts/:micropost_id', correctUser,
  MicropostsController.destroy);
router.get('/microposts/user_page/:user_id', MicropostsController.index);
router.get('/microposts/feed/:user_id/', correctUser, MicropostsController.index);
router.get('/microposts/count/:user_id', MicropostsController.count);

router.get('/sessions/authenticated', SessionsController.authenticated);
router.post('/sessions/', SessionsController.create);
router.delete('/sessions/logout', SessionsController.destroy);

router.get('/password_resets/valid_token', PasswordResetsController.valid);
router.post('/password_resets/', PasswordResetsController.create);
router.put('/password_resets/:id/:token', PasswordResetsController.update);

module.exports = router;
