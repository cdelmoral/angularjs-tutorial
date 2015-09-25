(function() {
'use strict';

angular
    .module('angularjsTutorial.sessions')
    .controller('SessionsDeleteCtrl', SessionsDeleteCtrl);

SessionsDeleteCtrl.$inject = ['$location', 'SessionsService'];

function SessionsDeleteCtrl($location, sessionsService) {
    var ctrl = this;

    initializeController();

    function initializeController() {
        if (sessionsService.currentUser !== null) {
            sessionsService.logout();
        }

        $location.path('/home').replace();
    }
}

})();
