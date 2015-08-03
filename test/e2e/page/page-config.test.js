describe('Application Routes', function() {
  var baseTitle = ' - AngularJS Tutorial';

  it('should redirect / to /home', function() {
    browser.get('/');
    browser.getLocationAbsUrl().then(function(url) {
        expect(url).toEqual('/home');
        expect(browser.getTitle()).toEqual('Home' + baseTitle);
      });
  });

  it('should redirect /ajbkc93 to /home', function() {
    browser.get('#/ajbkc93');
    browser.getLocationAbsUrl().then(function(url) {
        expect(url).toEqual('/home');
        expect(browser.getTitle()).toEqual('Home' + baseTitle);
      });
  });

  it('should redirect /help to /help', function() {
    browser.get('#/help');
    browser.getLocationAbsUrl().then(function(url) {
        expect(url).toEqual('/help');
        expect(browser.getTitle()).toEqual('Help' + baseTitle);
      });
  });

  it('should redirect /about to /about', function() {
    browser.get('#/about');
    browser.getLocationAbsUrl().then(function(url) {
        expect(url).toEqual('/about');
        expect(browser.getTitle()).toEqual('About' + baseTitle);
      });
  });

  it('should redirect /contact to /contact', function() {
    browser.get('#/contact');
    browser.getLocationAbsUrl().then(function(url) {
        expect(url).toEqual('/contact');
        expect(browser.getTitle()).toEqual('Contact' + baseTitle);
      });
  });

  it('should redirect /sign-up to /sign-up', function() {
    browser.get('#/sign-up');
    browser.getLocationAbsUrl().then(function(url) {
        expect(url).toEqual('/sign-up');
        expect(browser.getTitle()).toEqual('Sign up' + baseTitle);
      });
  });
});