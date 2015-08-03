describe('Controller: ContactCtrl', function() {

    beforeEach(module('angularjsTutorial.page'));

    var ContactCtrl;
    var rootScope;

    beforeEach(inject(function($controller, $rootScope) {
        ContactCtrl = $controller('ContactCtrl', {});
        rootScope = $rootScope.$new();
    }));

    it('should put in rootScope the correct title', function() {
        expect(rootScope.title).toBe('Contact - AngularJS Tutorial');
    });
});