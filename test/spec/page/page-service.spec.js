"use strict";

describe('Service: PageSvc', function() {

    beforeEach(module('angularjsTutorial.page'));

    var pageSvc;

    beforeEach(inject(function(PageSvc) {
        pageSvc = PageSvc;
    }));

    it('should build the page title with a section string', function() {
        expect(pageSvc.getPageTitle('The section')).toBe('The section - AngularJS Tutorial');
    });

    it('should build the page title without a section string', function() {
        expect(pageSvc.getPageTitle()).toBe('AngularJS Tutorial');
    });
});