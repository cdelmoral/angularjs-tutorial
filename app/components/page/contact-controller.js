(function() {
'use strict';

angular
    .module('angularjsTutorial.page')
    .controller('ContactCtrl', ContactCtrl);

ContactCtrl.$inject = ['$rootScope', 'PageSvc'];

function ContactCtrl($rootScope, pageSvc) {
    $rootScope.title = pageSvc.getPageTitle('Contact');
}

})();
