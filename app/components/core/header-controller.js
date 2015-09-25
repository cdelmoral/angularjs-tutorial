(function() {
'use strict';

angular
    .module('angularjsTutorial.core')
    .controller('HeaderCtrl', HeaderCtrl);

HeaderCtrl.$inject = ['$scope', 'SessionsService'];

function HeaderCtrl($scope, sessionsService) {
    var ctrl = this;

    ctrl.userLoggedIn = null;

    $scope.$on(sessionsService.LOGGING_EVENT, function() {
        ctrl.userLoggedIn = sessionsService.currentUser !== null;
    });
}

})();
