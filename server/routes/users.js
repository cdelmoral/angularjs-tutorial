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

/* Check if user name is available. */
router.get('/is_name_available', function(req, res, next) {
  User.count({name: req.query.name}, function (err, count) {
    if (err) {
        console.log(err);
        return next(err);
    }

    if (count === 1) {
      res.json({available: false});
    } else {
      res.json({available: true});
    }
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

/* Create new user. */
router.post('/', function(req, res, next) {
  var newUser = {
    name: req.body.name,
    email: req.body.email
  };

  User.create(newUser, function (err, user) {
    if (err) {
      return next(err);
    }

    res.json(user);
  });
});

module.exports = router;