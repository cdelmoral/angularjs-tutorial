(function() {
'use strict';

angular
    .module('angularjsTutorial.users')
    .controller('UsersNewCtrl', UsersNewCtrl);

UsersNewCtrl.$inject = ['$location', 'PageSvc', 'UsersService'];

function UsersNewCtrl($location, pageSvc, usersService) {
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
                    $location.path('/users/' + res._id).replace();
                }
            });
        }
    }
}

})();
