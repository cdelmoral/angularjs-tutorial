(function() {
'use strict';

angular
    .module('angularjsTutorial.page')
    .controller('AboutCtrl', AboutCtrl);

AboutCtrl.$inject = ['PageSvc'];

function AboutCtrl(pageSvc) {
    pageSvc.setPageTitle('About');
}

})();
