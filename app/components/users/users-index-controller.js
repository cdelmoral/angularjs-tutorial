(function() {
'use strict';

angular
    .module('angularjsTutorial.users')
    .controller('UsersIndexCtrl', UsersIndexCtrl);

UsersIndexCtrl.$inject = ['PageSvc', 'SessionsService', 'UsersService'];

function UsersIndexCtrl(pageSvc, sessionsService, usersService) {
    var ctrl = this;

    ctrl.users = [];

    initializeController();

    function initializeController() {
        sessionsService.requireLogin();

        pageSvc.setPageTitle('Users');

        ctrl.users = usersService.getUsersIndex();
    }
}

})();
