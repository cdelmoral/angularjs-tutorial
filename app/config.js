(function() {
'use strict';

angular
    .module('angularjsTutorial')
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
            templateUrl: 'components/users/users-new.html',
            controller: 'UsersNewCtrl',
            controllerAs: 'ctrl'
        })
        .when('/users', {
            templateUrl: 'components/users/users-index.html',
            controller: 'UsersIndexCtrl',
            controllerAs: 'ctrl'
        })
        .when('/users/:id', {
            templateUrl: 'components/users/users-show.html',
            controller: 'UsersShowCtrl',
            controllerAs: 'ctrl'
        })
        .when('/login', {
            templateUrl: 'components/sessions/sessions-new.html',
            controller: 'SessionsNewCtrl',
            controllerAs: 'ctrl'
        })
        .otherwise({
            redirectTo: '/home'
        });
}

})();
