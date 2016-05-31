var User = require('../../src/users/user-model');
var should = require('should');
var validator = require('validator');

var user;

describe('User model', function() {
  beforeEach(function(done) {
    carlos = new User({ name: 'Carlos', email: 'carlos@test.com', password: 'password' });
    victor = new User({ name: 'Victor', email: 'victor@test.com', password: 'password' });
    User.ensureIndexes().then(function() {
      User.create([carlos, victor]).then(function(users) {
        done();
      });
    });
  });

  describe('when creating users', function() {
    it('should save valid users', function() {
      other = new User({ name: 'Other', email: 'other@test.com', password: 'password' });
      return other.save().should.be.fulfilled();
    });

    it('should not be valid with not unique name', function() {
      other = new User({ name: 'Carlos', email: 'other@test.com', password: 'password' });
      return other.save().should.be.rejected();
    });

    it('should not be valid with not unique email', function() {
      other = new User({ name: 'Other', email: 'carlos@test.com', password: 'password' });
      return other.save().should.be.rejected();
    });
  });

  it('should not be valid with null name', function() {
    carlos.name = null;
    return carlos.validate().should.be.rejected();
  });

  it('should not be valid with empty name', function() {
    carlos.name = '     ';
    return carlos.validate().should.be.rejected();
  });

  it('should not be valid when name is too long', function() {
    carlos.name = Array(52).join('a');
    return carlos.validate().should.be.rejected();
  });

  it('should not be valid with null email', function() {
    carlos.email = null;
    return carlos.validate().should.be.rejected();
  });

  it('should not be valid with empty email', function() {
    carlos.email = '     ';
    return carlos.validate().should.be.rejected();
  });

  it('should not be valid when email is too long', function() {
    carlos.email = Array(255).join('a') + '@example.com';
    return carlos.validate().should.be.rejected();
  });

  describe('with valid emails', function() {
    var validEmails = [
      'user@example.com',
      'USER@foo.COM',
      'A_US-ER@foo.bar.org',
      'first.last@foo.jp',
      'alice+bob@baz.cn'
    ];

    validEmails.forEach(function(email) {
      it('should be valid', function() {
        carlos.email = email;
        carlos.validate().should.be.fulfilled();
      });
    });
  });

  describe('with invalid emails', function() {
    var invalidEmails = [
      'user@example,com',
      'user_at_foo.org',
      'user.name@example.',
      'foo@bar_baz.com',
      'foo@bar+baz.com'
    ];

    invalidEmails.forEach(function(email) {
      it('should not be valid', function() {
        carlos.email = email;
        carlos.validate().should.be.rejected();
      });
    });
  });

  it('should follow a user', function() {
    return carlos.follow(victor).then(function() {
      return carlos.isFollowing(victor);
    }).should.be.fulfilledWith(true);
  });

  it('should unfollow a user', function() {
    return carlos.follow(victor).then(function() {
      return carlos.unfollow(victor).then(function() {
        return carlos.isFollowing(victor);
      });
    }).should.be.fulfilledWith(false);
  });
});
