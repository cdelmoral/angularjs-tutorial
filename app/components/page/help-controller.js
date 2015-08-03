(function() {
'use strict';

angular
    .module('angularjsTutorial.page')
    .controller('HelpCtrl', HelpCtrl);

HelpCtrl.$inject = ['$rootScope', 'PageSvc'];

function HelpCtrl($rootScope, pageSvc) {
    $rootScope.title = pageSvc.getPageTitle('Help');
}

})();
