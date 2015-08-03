describe('Controller: HomeCtrl', function() {

    beforeEach(module('angularjsTutorial.page'));

    var HomeCtrl;
    var rootScope;

    beforeEach(inject(function($controller, $rootScope) {
        HomeCtrl = $controller('HomeCtrl', {});
        rootScope = $rootScope.$new();
    }));

    it('should put in rootScope the correct title', function() {
        expect(rootScope.title).toBe('Home - AngularJS Tutorial');
    });
});