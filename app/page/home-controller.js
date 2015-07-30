(function() {
'use strict';

angular
    .module('angularjsTutorial.page')
    .controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = ['$rootScope'];

function HomeCtrl($rootScope) {
    $rootScope.title = 'Home - AngularJS Tutorial';
}

})();
