(function() {
'use strict';

angular
    .module('angularjsTutorial.page')
    .controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = ['PageSvc', 'SessionsService'];

function HomeCtrl(pageSvc, sessionsService) {
    var ctrl = this;

    ctrl.userLoggedIn = false;

    initializeController();

    // Private methods

    function initializeController() {
        ctrl.userLoggedIn = sessionsService.currentUser !== null;

        pageSvc.setPageTitle('Home');
    }
}

})();
