(function() {
'use strict';

angular
    .module('angularjsTutorial.page')
    .config(Config);

Config.$inject = ['$routeProvider'];

function Config($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'components/page/home.html',
            controller: 'HomeCtrl'
        })
        .when('/help', {
            templateUrl: 'components/page/help.html',
            controller: 'HelpCtrl'
        })
        .when('/about', {
            templateUrl: 'components/page/about.html',
            controller: 'AboutCtrl'
        })
        .when('/contact', {
            templateUrl: 'components/page/contact.html',
            controller: 'ContactCtrl'
        })
        .when('/sign-up', {
            templateUrl: 'components/users/new.html'
        })
        .otherwise({
            redirectTo: '/home'
        });
}

})();
