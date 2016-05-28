var User = require('../../src/users/user-model');
var should = require('should');
var validator = require('validator');

var user;

describe('User model', function() {
  beforeEach(function() {
    user = new User({ name: 'Carlos', email: 'carlos@test.com', password: 'password' });
  });

  describe('with valid parameters', function() {
    it('should save in the database', function() {
      user.save().should.be.fulfilled();
    });
  });

  describe('with existing user', function() {
    beforeEach(function(done) {
      user.save(done);
    });

    it('should not be valid with not unique name', function() {
      other = new User({ name: 'Carlos', email: 'other@test.com', password: 'password' });
      other.save().should.be.rejected();
    });

    it('should not be valid with not unique email', function() {
      other = new User({ name: 'Victor', email: 'carlos@test.com', password: 'password' });
      other.save().should.be.rejected();
    });
  });

  it('should not be valid with null name', function() {
    user.name = null;
    user.validate().should.be.rejected();
  });

  it('should not be valid with empty name', function() {
    user.name = '     ';
    user.validate().should.be.rejected();
  });

  it('should not be valid when name is too long', function() {
    user.name = Array(52).join('a');
    user.validate().should.be.rejected();
  });

  it('should not be valid with null email', function() {
    user.email = null;
    user.validate().should.be.rejected();
  });

  it('should not be valid with empty email', function() {
    user.email = '     ';
    user.validate().should.be.rejected();
  });

  it('should not be valid when email is too long', function() {
    user.email = Array(255).join('a') + '@example.com';
    user.validate().should.be.rejected();
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
        user.email = email;
        user.validate().should.be.fulfilled();
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
        user.email = email;
        user.validate().should.be.rejected();
      });
    });
  });
});
