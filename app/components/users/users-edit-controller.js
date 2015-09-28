(function() {
    'use strict';

    angular
        .module('angularjsTutorial.users')
        .controller('UsersEditCtrl', UsersEditCtrl);

    UsersEditCtrl.$inject = ['$location', '$q', '$routeParams', 'PageSvc', 'SessionsService', 'UsersService', 'flash'];

    function UsersEditCtrl($location, $q, $routeParams, pageSvc, sessionsService, usersService, flash) {
        var ctrl = this;

        /** User being edited. */
        ctrl.user = {};

        /** Holds the password confirmation. */
        ctrl.confirmation = '';

        ctrl.updateUser = updateUser;
        ctrl.isNameUnique = isNameUnique;
        ctrl.isEmailUnique = isEmailUnique;

        initializeController();

        function updateUser() {
            usersService.updateUser(ctrl.user).then(function(user) {
                if (user && user.id) {
                    flash.success = 'Your profile was successfully updated!';
                    sessionsService.currentUser = user;
                    $location.path(usersService.userPath(user)).replace();
                }
            })
        }

        function isNameUnique(value) {
            return usersService.isNameUnique(value);
        }

        function isEmailUnique(value) {
            return usersService.isEmailUnique(value);
        }

        // Private methods

        function initializeController() {
            sessionsService.requireLogin();
            pageSvc.setPageTitle('Edit user');
            ctrl.user = usersService.getUser($routeParams.id);
        }
    }

})();
