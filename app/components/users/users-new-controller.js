(function() {
'use strict';

angular
    .module('angularjsTutorial.users')
    .controller('UsersNewCtrl', UsersNewCtrl);

UsersNewCtrl.$inject = ['$location', 'PageSvc', 'UsersService', 'flash'];

function UsersNewCtrl($location, pageSvc, usersService, flash) {
    var ctrl = this;

    ctrl.user = {};

    ctrl.confirmation = '';

    ctrl.createUser = createUser;

    var requestSent = false;

    initializeController();

    function initializeController() {
        pageSvc.setPageTitle('Sign up');
    }

    function createUser() {
        if (!requestSent) {
            requestSent = true;
            usersService.save(ctrl.user, function(res) {
                requestSent = false;
                if (res && res._id) {
                    flash.success = 'Welcome to the sample app!';
                    $location.path('/users/' + res._id).replace();
                }
            });
        }
    }
}

})();
