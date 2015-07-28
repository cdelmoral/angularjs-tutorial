(function() {
'use strict';

angular
    .module('angularjsTutorial')
    .config(Config);

Config.$inject = ['$routeProvider'];

function Config($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'templates/home.html'
        })
        .when('/help', {
            templateUrl: 'templates/help.html'
        })
        .otherwise({
            redirectTo: '/home'
        });
}

})();
