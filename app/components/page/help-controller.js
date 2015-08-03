(function() {
'use strict';

angular
    .module('angularjsTutorial.page')
    .controller('HelpCtrl', HelpCtrl);

HelpCtrl.$inject = ['PageSvc'];

function HelpCtrl(pageSvc) {
    pageSvc.setPageTitle('Help');
}

})();
