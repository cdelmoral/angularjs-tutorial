var express = require('express');
var router = express.Router();

var UsersController = require('./users/users-controller');

var requireLogin = require('./sessions/sessions-helper').requireLogin;
var requireCorrectUser = require('./sessions/sessions-helper').requireCorrectUser;

router.get('/users/is_unique', UsersController.isUnique);
router.get('/users/index_page', requireLogin, UsersController.getIndexPage);
router.get('/users/:id', requireLogin, UsersController.getUserById);

router.post('/users/', UsersController.createUser);

router.put('/users/activate/:id/:token', UsersController.activateUser);
router.put('/users/:id', requireCorrectUser, UsersController.updateUser);
router.put('/users/new_micropost/:id', requireCorrectUser, UsersController.createMicropost);

router.delete('/users/:id', requireLogin, UsersController.deleteUser);
router.delete('/users/:id/:micropost_id', requireCorrectUser, UsersController.deleteMicropost);

module.exports = router;
