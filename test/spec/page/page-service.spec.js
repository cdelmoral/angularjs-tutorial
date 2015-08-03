describe('Service: PageSvc', function() {

    beforeEach(module('angularjsTutorial.page'));

    var pageSvc;
    var rootScope;

    beforeEach(inject(function($rootScope, PageSvc) {
        pageSvc = PageSvc;
        rootScope = $rootScope.$new();
    }));

    it('should build the page title with a section string', function() {
        pageSvc.setPageTitle('The section');
        expect(rootScope.title).toBe('The section - AngularJS Tutorial');
    });

    it('should build the page title without a section string', function() {
        pageSvc.setPageTitle();
        expect(rootScope.title).toBe('AngularJS Tutorial');
    });
});