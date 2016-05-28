var User = require('../../src/users/user-model');
var Relationship = require('../../src/users/relationship-model');
var should = require('should');
var validator = require('validator');

var follower;
var followed;
var relationship;

describe('Relationship model', function() {
  beforeEach(function(done) {
    carlos = { name: 'Carlos', email: 'carlos@test.com', password: 'password' };
    steve = { name: 'Steve', email: 'steve@test.com', password: 'password' };
    User.create([carlos, steve]).then(function(users) {
      follower = users[0];
      followed = users[1];
      relationship = new Relationship({ follower_id: follower._id, followed_id: followed._id });
      done();
    });
  });

  describe('with valid parameters', function() {
    it('should save in the database', function() {
      relationship.save().should.be.fulfilled();
    });
  });

  describe('with existing relationship', function() {
    beforeEach(function(done) {
      relationship.save(done);
    });

    it('should not be valid with not unique relationship', function() {
      other = new Relationship({ follower_id: follower._id, followed_id: followed._id });
      other.save().should.be.rejected();
    });
  });
});
