(function() {
'use strict';

angular
    .module('angularjsTutorial.page')
    .controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = ['$rootScope', 'PageSvc'];

function HomeCtrl($rootScope, pageSvc) {
    $rootScope.title = pageSvc.getPageTitle('Home');
}

})();
