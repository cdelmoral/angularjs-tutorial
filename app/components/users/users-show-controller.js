(function() {
'use strict';

angular
    .module('angularjsTutorial.users')
    .controller('UsersShowCtrl', UsersShowCtrl);

UsersShowCtrl.$inject = ['PageSvc', '$routeParams', 'UsersService'];

function UsersShowCtrl(pageSvc, $routeParams, userService) {
    var ctrl = this;

    ctrl.user = {};

    initializeController();

    function initializeController() {
        pageSvc.setPageTitle('Show user');
        userService.getUserById($routeParams.id).success(function(user) {
            ctrl.user = user;
        }).error(function(data, status) {
            console.log(data, status);
            ctrl.user = {};
        });
    }
}

})();
