(function() {
'use strict';

angular
    .module('angularjsTutorial.page')
    .controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = ['PageSvc'];

function HomeCtrl(pageSvc) {
    pageSvc.setPageTitle('Home');
}

})();
