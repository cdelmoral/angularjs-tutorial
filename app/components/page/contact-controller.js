(function() {
'use strict';

angular
    .module('angularjsTutorial.page')
    .controller('ContactCtrl', ContactCtrl);

ContactCtrl.$inject = ['PageSvc'];

function ContactCtrl(pageSvc) {
    pageSvc.setPageTitle('Contact');
}

})();
