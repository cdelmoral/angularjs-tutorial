(function() {
'use strict';

angular
    .module('angularjsTutorial.users')
    .controller('UsersNewCtrl', UsersNewCtrl);

UsersNewCtrl.$inject = ['PageSvc', 'UsersService'];

function UsersNewCtrl(pageSvc, usersService) {
    var ctrl = this;

    ctrl.user = {};

    ctrl.password = '';
    ctrl.confirmation = '';

    ctrl.createUser = createUser;

    initializeController();

    function initializeController() {
        pageSvc.setPageTitle('Sign up');
    }

    function createUser() {
        usersService.save(ctrl.user);
    }
}

})();
