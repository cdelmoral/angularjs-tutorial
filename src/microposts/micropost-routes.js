var express = require('express');
var session = require('express-session');
var router = express.Router();

var mongoose = require('mongoose');
var Micropost = require('./micropost-model');

router.get('/user_page/:userId', getMicropostPageForUser);
router.get('/count/:userId', getMicropostCountForUser);

module.exports = router;

function getMicropostPageForUser(req, res, next) {
    var userId = req.params.userId;
    var pageNumber = req.query.pageNumber || 1;
    var micropostsPerPage = req.query.micropostsPerPage || 25;

    Micropost.getMicropostsPageForUser(userId, pageNumber, micropostsPerPage)
        .then(function(microposts) {
            Micropost.getMicropostsCountForUser(userId)
                .then(function(count) {
                    res.json({ count: count, microposts: microposts });
                });
        });
}

function getMicropostCountForUser(req, res, nest) {
    var userId = req.params.userId;

    Micropost.getMicropostsCountForUser(userId)
        .then(function(count) {
            res.json({ count: count });
        });
}
