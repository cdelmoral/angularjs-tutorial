(function() {
'use strict';

angular
    .module('angularjsTutorial.users')
    .controller('UsersShowCtrl', UsersShowCtrl);

UsersShowCtrl.$inject = ['$routeParams', 'PageSvc', 'UsersService'];

function UsersShowCtrl($routeParams, pageSvc, usersService) {
    var ctrl = this;

    ctrl.user = {};

    initializeController();

    function initializeController() {
        pageSvc.setPageTitle('Show user');

        ctrl.user = usersService.getUser($routeParams.id);
    }
}

})();
