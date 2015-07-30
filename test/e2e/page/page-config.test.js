describe('Application Routes', function() {
  it('should redirect / to /home', function() {
    browser.get('/');
    browser.getLocationAbsUrl().then(function(url) {
        expect(url).toEqual('/home');
        expect(browser.getTitle()).toEqual('Home - AngularJS Tutorial');
      });
  });

  it('should redirect /help to /help', function() {
    browser.get('#/help');
    browser.getLocationAbsUrl().then(function(url) {
        expect(url).toEqual('/help');
        expect(browser.getTitle()).toEqual('Help - AngularJS Tutorial');
      });
  });

  it('should redirect /about to /about', function() {
    browser.get('#/about');
    browser.getLocationAbsUrl().then(function(url) {
        expect(url).toEqual('/about');
        expect(browser.getTitle()).toEqual('About - AngularJS Tutorial');
      });
  });
});