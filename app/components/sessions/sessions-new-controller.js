(function() {
'use strict';

angular
    .module('angularjsTutorial.sessions')
    .controller('SessionsNewCtrl', SessionsNewCtrl);

SessionsNewCtrl.$inject = ['$location', 'flash', 'PageSvc', 'SessionsService'];

function SessionsNewCtrl($location, flash, pageSvc, sessionsService) {
    var ctrl = this;

    ctrl.user = {};
    ctrl.createSession = createSession;

    initializeController();

    function initializeController() {
        pageSvc.setPageTitle('Log in');
    }

    function createSession() {
        sessionsService.authenticate(ctrl.user).then(function(user) {
            flash.success = 'Welcome!';
            if (sessionsService.beforeLoginAttempt === null) {
                $location.path('/users/' + user.id).replace();
            } else {
                $location.path(beforeLoginAttempt).replace();
                sessionsService.beforeLoginAttempt = null;
            }
        }).catch(function() {
            flash.error = 'Invalid login';
            $location.path('/login').replace();
        });
    }
}

})();
