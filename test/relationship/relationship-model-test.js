var User = require('../../src/users/user-model');
var Relationship = require('../../src/users/relationship-model');
var should = require('should');
var validator = require('validator');

var follower;
var followed;
var relationship;

beforeEach(function(done) {
  follower = new User({ name: 'Carlos', email: 'carlos@test.com', password: 'password' });
  followed = new User({ name: 'Steve', email: 'steve@test.com', password: 'password' });
  User.collection.insert([follower, followed]).then(function(users) {
    relationship = new Relationship({ follower_id: users[0]._id, followed_id: users[1]._id });
    Relationship.ensureIndexex(function(err) {
      done(err);
    });
  });
});

describe('Relationship model', function() {
  describe('with valid parameters', function() {
    it('should save in the database', function(done) {
      relationship.save(function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('with existing relationship', function() {
    beforeEach(function(done) {
      relationship.save(done);
    });

    it('should not be valid with not unique relationship', function(done) {
      other = new Relationship({ follower_id: follower._id, followed_id: followed._id });
      other.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });
});
