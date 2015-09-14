(function() {
'use strict';

angular
    .module('angularjsTutorial.sessions')
    .controller('SessionsNewCtrl', SessionsNewCtrl);

SessionsNewCtrl.$inject = ['PageSvc'];

function SessionsNewCtrl(pageSvc) {
    var ctrl = this;

    ctrl.user = {};
    ctrl.createSession = createSession;

    initializeController();

    function initializeController() {
        pageSvc.setPageTitle('Log in');
    }

    function createSession() {
        console.log('Create a session');
    }
}

})();
