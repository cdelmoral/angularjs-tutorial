var User = require('../../src/users/user-model');
var should = require('should');
var validator = require('validator');
var mongoose = require('mongoose');

var user;

before(function(done) {
  mongoose.connect("mongodb://localhost/angularjs_tutorial_test", function(err) {
    done(err);
  });
});

beforeEach(function(done) {
  user = new User({ name: 'Carlos', email: 'carlos@test.com', password: 'password' });
  User.ensureIndexes(function(err) {
    done(err);
  });
});

afterEach(function(done) {
  mongoose.connection.db.dropDatabase(function(err) {
    done(err);
  });
});

describe('User model', function() {
  describe('with valid parameters', function() {
    it('should save in the database', function(done) {
      user.save(function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('with existing user', function() {
    beforeEach(function(done) {
      user.save(done);
    });

    it('should not be valid with not unique name', function(done) {
      other = new User({ name: 'Carlos', email: 'other@test.com', password: 'password' });
      other.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should not be valid with not unique email', function(done) {
      other = new User({ name: 'Victor', email: 'carlos@test.com', password: 'password' });
      other.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should not be valid with null name', function(done) {
    user.name = null;
    user.validate(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should not be valid with empty name', function(done) {
    user.name = '     ';
    user.validate(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should not be valid when name is too long', function(done) {
    user.name = Array(52).join('a');
    user.validate(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should not be valid with null email', function(done) {
    user.email = null;
    user.validate(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should not be valid with empty email', function(done) {
    user.email = '     ';
    user.validate(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should not be valid when email is too long', function(done) {
    user.email = Array(255).join('a') + '@example.com';
    user.validate(function(err) {
      should.exist(err);
      done();
    });
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
      it('should be valid', function(done) {
        user.email = email;
        user.validate(function(err) {
          should.not.exist(err);
          done();
        });
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
      it('should not be valid', function(done) {
        user.email = email;
        user.validate(function(err) {
          should.exist(err);
          done();
        });
      });
    });
  });
});
