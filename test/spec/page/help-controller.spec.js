"use strict";

describe('Controller: HelpCtrl', function() {

    beforeEach(module('angularjsTutorial.page'));

    var HelpCtrl;
    var rootScope;

    beforeEach(inject(function($controller, $rootScope) {
        HelpCtrl = $controller('HelpCtrl', {});
        rootScope = $rootScope.$new();
    }));

    it('should put in rootScope the correct title', function() {
        expect(rootScope.title).toBe('Help - AngularJS Tutorial');
    });
});