(function() {
'use strict';

angular
    .module('angularjsTutorial.sessions')
    .controller('SessionsNewCtrl', SessionsNewCtrl);

SessionsNewCtrl.$inject = ['PageSvc', 'SessionsService'];

function SessionsNewCtrl(pageSvc, sessionsService) {
    var ctrl = this;

    ctrl.user = {};
    ctrl.createSession = createSession;

    initializeController();

    function initializeController() {
        pageSvc.setPageTitle('Log in');
    }

    function createSession() {
        sessionsService.authenticate(ctrl.user);
    }
}

})();
