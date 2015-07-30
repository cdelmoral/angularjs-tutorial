(function() {
'use strict';

angular
    .module('angularjsTutorial.page')
    .controller('AboutCtrl', AboutCtrl);

AboutCtrl.$inject = ['$rootScope'];

function AboutCtrl($rootScope) {
    $rootScope.title = 'About - AngularJS Tutorial';
}

})();
