(function() {
'use strict';

angular
    .module('angularjsTutorial.page')
    .config(Config);

Config.$inject = ['$routeProvider'];

function Config($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'page/home.html',
            controller: 'HomeCtrl'
        })
        .when('/help', {
            templateUrl: 'page/help.html',
            controller: 'HelpCtrl'
        })
        .when('/about', {
            templateUrl: 'page/about.html',
            controller: 'AboutCtrl'
        })
        .otherwise({
            redirectTo: '/home'
        });
}

})();
