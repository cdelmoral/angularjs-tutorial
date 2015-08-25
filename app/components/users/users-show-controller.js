(function() {
'use strict';

angular
    .module('angularjsTutorial.users')
    .controller('UsersShowCtrl', UsersShowCtrl);

UsersShowCtrl.$inject = ['PageSvc', '$routeParams', 'UsersService'];

function UsersShowCtrl(pageSvc, $routeParams, userService) {
    var ctrl = this;

    ctrl.user = {};

    initializeController();

    function initializeController() {
        pageSvc.setPageTitle('Show user');

        ctrl.user = userService.get({id: $routeParams.id});
    }
}

})();
