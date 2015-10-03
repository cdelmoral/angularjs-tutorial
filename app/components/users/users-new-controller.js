(function() {
'use strict';

angular
    .module('angularjsTutorial.users')
    .controller('UsersNewCtrl', UsersNewCtrl);

UsersNewCtrl.$inject = ['$location', 'PageSvc', 'SessionsService', 'UsersService', 'flash'];

function UsersNewCtrl($location, pageSvc, sessionsService, usersService, flash) {
    var ctrl = this;

    ctrl.user = {};

    ctrl.confirmation = '';

    ctrl.createUser = createUser;
    ctrl.isNameUnique = isNameUnique;
    ctrl.isEmailUnique = isEmailUnique;

    // Private variables

    var requestSent = false;

    initializeController();

    function createUser() {
        if (!requestSent) {
            requestSent = true;
            usersService.createUser(ctrl.user).then(function(user) {
                requestSent = false;
                if (user && user.id) {
                    flash.success = 'Welcome to the sample app!';
                    sessionsService.authenticate(ctrl.user);
                    $location.path(usersService.userPath(user)).replace();
                }
            });
        }
    }

    function isNameUnique(value) {
        return usersService.isNameUnique(value);
    }

    function isEmailUnique(value) {
        return usersService.isEmailUnique(value);
    }

    // Private methods

    function initializeController() {
        if (sessionsService.currentUser) {
            $location.path(usersService.userPath(sessionsService.currentUser)).replace();
        }

        pageSvc.setPageTitle('Sign up');
    }
}

})();
