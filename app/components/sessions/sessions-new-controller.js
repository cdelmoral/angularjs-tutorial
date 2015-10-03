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

    function createSession() {
        sessionsService.authenticate(ctrl.user).then(function(user) {
            flash.success = 'Welcome!';
            if (sessionsService.beforeLoginAttempt === null) {
                $location.path('/users/' + user.id).replace();
            } else {
                $location.path(sessionsService.beforeLoginAttempt).replace();
                sessionsService.beforeLoginAttempt = null;
            }
        }).catch(function() {
            flash.error = 'Invalid login';
            $location.path('/login').replace();
        });
    }

    // Private methods

    function initializeController() {
        if (sessionsService.currentUser) {
            $location.path('/users/' + sessionsService.currentUser.id).replace();
        }

        pageSvc.setPageTitle('Log in');
    }
}

})();
