(function() {
'use strict';

angular
    .module('angularjsTutorial.page')
    .controller('HelpCtrl', HelpCtrl);

HelpCtrl.$inject = ['$rootScope'];

function HelpCtrl($rootScope) {
    $rootScope.title = 'Help - AngularJS Tutorial';
}

})();
