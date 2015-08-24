var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../user/user-model.js');

/* Get users listing. */
router.get('/', function(req, res, next) {
  User.find(function (err, users) {
    if (err) {
      return next(err);
    }
    
    res.json(users);
  });
});

/* Get user by id. */
router.get('/:id', function(req, res, next) {
  User.findById(req.params.id, function (err, user) {
    if (err) {
        return next(err);
    }

    res.json(user);
  });
});

module.exports = router;