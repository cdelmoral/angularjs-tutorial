describe('Application Routes', function() {
  it('should redirect / to /home', function() {
    browser.get('/');
    browser.getLocationAbsUrl().then(function(url) {
        expect(url).toEqual('/home');
      });
  });

  it('should redirect /help to /help', function() {
    browser.get('#/help');
    browser.getLocationAbsUrl().then(function(url) {
        expect(url).toEqual('/help');
      });
  });
});