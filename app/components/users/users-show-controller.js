(function() {
'use strict';

angular
    .module('angularjsTutorial.users')
    .controller('UsersShowCtrl', UsersShowCtrl);

UsersShowCtrl.$inject = ['$routeParams', 'PageSvc', 'SessionsService', 'UsersService'];

function UsersShowCtrl($routeParams, pageSvc, sessionsService, usersService) {
    var ctrl = this;

    ctrl.user = {};

    initializeController();

    function initializeController() {
        sessionsService.requireLogin();

        pageSvc.setPageTitle('Show user');

        ctrl.user = usersService.getUser($routeParams.id);
    }
}

})();
