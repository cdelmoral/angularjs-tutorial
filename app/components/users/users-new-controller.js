(function() {
'use strict';

angular
    .module('angularjsTutorial.users')
    .controller('UsersNewCtrl', UsersNewCtrl);

UsersNewCtrl.$inject = ['PageSvc'];

function UsersNewCtrl(pageSvc) {
    var ctrl = this;

    ctrl.user = {
        name: '',
        email: ''
    };

    ctrl.password = '';
    ctrl.confirmation = '';

    ctrl.createUser = createUser;

    initializeController();

    function initializeController() {
        pageSvc.setPageTitle('Sign up');
    }

    function createUser() {
        console.log('User ready to be created: ' + ctrl.user);
    }
}

})();
