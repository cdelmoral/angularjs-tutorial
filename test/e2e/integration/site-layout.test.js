describe('Site layout', function() {

    it('should have the correct links at /', function() {
        browser.get('/');
        expect(element.all(by.css('a[href=\"#/\"]')).count()).toBe(2);
        expect(element.all(by.css('a[href=\"#/help\"]')).count()).toBe(1);
        expect(element.all(by.css('a[href=\"#/about\"]')).count()).toBe(1);
        expect(element.all(by.css('a[href=\"#/contact\"]')).count()).toBe(1);
    });

});