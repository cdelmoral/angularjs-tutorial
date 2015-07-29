(function() {
'use strict';

angular
    .module('angularjsTutorial')
    .config(Config);

Config.$inject = ['$routeProvider'];

function Config($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'static-pages/home.html'
        })
        .when('/help', {
            templateUrl: 'static-pages/help.html'
        })
        .otherwise({
            redirectTo: '/home'
        });
}

})();
