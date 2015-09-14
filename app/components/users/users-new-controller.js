(function() {
'use strict';

angular
    .module('angularjsTutorial.users')
    .controller('UsersNewCtrl', UsersNewCtrl);

UsersNewCtrl.$inject = ['$location', '$q', 'PageSvc', 'UsersService', 'flash'];

function UsersNewCtrl($location, $q, pageSvc, usersService, flash) {
    var ctrl = this;

    ctrl.user = {};

    ctrl.confirmation = '';

    ctrl.createUser = createUser;
    ctrl.isNameUnique = isNameUnique;
    ctrl.isEmailUnique = isEmailUnique;

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

    function isNameUnique(value) {
        var params = { name: value };
        return checkUnique(params);
    }

    function isEmailUnique(value) {
        var params = { email: value };
        return checkUnique(params);
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
