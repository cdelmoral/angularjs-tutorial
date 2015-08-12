var User = require('../../../server/user/user-model');
var should = require('should');

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

    it('should have a non-null name', function(done) {
        user.name = null;
        user.validate(function(err) {
            should(err).not.undefined();
            should(err.errors.name.kind).equal('required');
            done();
        });
    });
});
