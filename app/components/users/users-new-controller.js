(function() {
'use strict';

angular
    .module('angularjsTutorial.users')
    .controller('UsersNewCtrl', UsersNewCtrl);

UsersNewCtrl.$inject = ['PageSvc'];

function UsersNewCtrl(pageSvc) {
    pageSvc.setPageTitle('Sign up');
}

})();
