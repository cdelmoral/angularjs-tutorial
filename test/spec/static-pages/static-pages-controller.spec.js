describe('Controller: StaticpagesCtrl', function () {

  // load the controller's module
  beforeEach(module('angularjsTutorial.staticPages'));

  var StaticPagesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StaticPagesCtrl = $controller('StaticPagesCtrl', {
      $scope: scope
    });
  }));

  it('initialize with value 5', function () {
    expect(StaticPagesCtrl.shouldBeFive).toBe(5);
  });
});
