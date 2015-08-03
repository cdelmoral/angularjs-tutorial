describe('Controller: usersNewCtrl', function() {

    beforeEach(module('angularjsTutorial.users'));

    var usersNewCtrl;
    var rootScope;

    beforeEach(inject(function($controller, $rootScope) {
        usersNewCtrl = $controller('UsersNewCtrl', {});
        rootScope = $rootScope.$new();
    }));

    it('should put in rootScope the correct title', function() {
        expect(rootScope.title).toBe('Sign up - AngularJS Tutorial');
    });
});