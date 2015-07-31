(function() {
'use strict';

angular
    .module('angularjsTutorial.page')
    .controller('AboutCtrl', AboutCtrl);

AboutCtrl.$inject = ['$rootScope', 'PageSvc'];

function AboutCtrl($rootScope, pageSvc) {
    $rootScope.title = pageSvc.getPageTitle('About');
}

})();
