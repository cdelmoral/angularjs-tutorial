describe('Controller: AboutCtrl', function() {

    beforeEach(module('angularjsTutorial.page'));

    var AboutCtrl;
    var rootScope;

    beforeEach(inject(function($controller, $rootScope) {
        AboutCtrl = $controller('AboutCtrl', {});
        rootScope = $rootScope.$new();
    }));

    it('should put in rootScope the correct title', function() {
        expect(rootScope.title).toBe('About - AngularJS Tutorial');
    });
});