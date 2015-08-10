var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../user/user-model.js');

/* GET /users listing. */
router.get('/', function(req, res, next) {
  User.find(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

/* POST /users. */
router.post('/', function(req, res, next) {
  User.create(req.body, function (err, user) {
    if (err) {
        return next(err);
    }

    res.json(user);
  });
});

/* GET /users/id. */
router.get('/:id', function(req, res, next) {
  User.findById(req.params.id, function (err, user) {
    if (err) {
        return next(err);
    }

    res.json(user);
  });
});

/* PUT /users/:id */
router.put('/:id', function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
    if (err) {
        return next(err);
    }

    res.json(user);
  });
});

/* DELETE /users/:id */
router.delete('/:id', function(req, res, next) {
  User.findByIdAndRemove(req.params.id, req.body, function (err, user) {
    if (err) {
        return next(err);
    }

    res.json(user);
  });
});

module.exports = router;