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
            usersService.update({id: ctrl.user.id}, ctrl.user, function(user) {
                if (user && user.id) {
                    flash.success = 'Your profile was successfully updated!';
                    sessionsService.currentUser = user;
                    $location.path('/users/' + user.id).replace();
                }
            })
        }

        function isNameUnique(value) {
            var params = { name: value };
            return checkUnique(params);
        }

        function isEmailUnique(value) {
            var params = { email: value };
            return checkUnique(params);
        }

        // Private methods

        function initializeController() {
            sessionsService.requireLogin();
            pageSvc.setPageTitle('Edit user');
            ctrl.user = usersService.get({id: $routeParams.id});
        }

        function checkUnique(params) {
            var defer = $q.defer();
            usersService.isAvailable(params, function(res) {
                if (res && res.valid) {
                    defer.resolve();
                } else {
                    defer.reject();
                }
            });

            return defer.promise;
        }
    }

})();
