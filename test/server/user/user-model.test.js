var User = require('../../../server/user/user-model');
var should = require('should');
var validator = require('validator');

describe('Model: User', function() {

    var user;

    beforeEach(function() {
        user = new User();
        user.name = 'User Name';
        user.email = 'test@test.com';
    });

    it('should be valid', function(done) {
        user.validate(function(err) {
            should(err).undefined();
            done();
        });
    });

    it('should not be valid with null name', function(done) {
        user.name = null;
        user.validate(function(err) {
            should(err).not.undefined();
            done();
        });
    });

    it('should not be valid with empty name', function(done) {
        user.name = '     ';
        user.validate(function(err) {
            should(err).not.undefined();
            done();
        });
    });

    it('should not be valid when name is too long', function(done) {
        user.name = Array(52).join('a');
        user.validate(function(err) {
            should(err).not.undefined();
            done();
        });
    });

    it('should not be valid with null email', function(done) {
        user.email = null;
        user.validate(function(err) {
            should(err).not.undefined();
            done();
        });
    });

    it('should not be valid with empty email', function(done) {
        user.email = '     ';
        user.validate(function(err) {
            should(err).not.undefined();
            done();
        });
    });

    it('should not be valid when email is too long', function(done) {
        user.email = Array(255).join('a') + '@example.com';
        user.validate(function(err) {
            should(err).not.undefined();
            done();
        });
    });

    describe('valid emails', function() {
        var validEmails = ['user@example.com', 'USER@foo.COM', 'A_US-ER@foo.bar.org',
                           'first.last@foo.jp', 'alice+bob@baz.cn'];

        validEmails.forEach(function(email) {
            it('should be valid', function(done) {
                user.email = email;
                user.validate(function(err) {
                    should(err).undefined();
                    done();
                });
            });
        });
    });

    describe('invalid emails', function() {
        var invalidEmails = ['user@example,com', 'user_at_foo.org', 'user.name@example.',
                           'foo@bar_baz.com', 'foo@bar+baz.com'];

        invalidEmails.forEach(function(email) {
            it('should not be valid', function(done) {
                user.email = email;
                user.validate(function(err) {
                    should(err).not.undefined();
                    done();
                });
            });
        });
    });

    
});
