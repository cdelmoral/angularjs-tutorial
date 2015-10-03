(function() {
'use strict';

angular
    .module('angularjsTutorial')
    .run(Run)
    .config(Config);

Run.$inject = ['SessionsService'];
Config.$inject = ['$routeProvider'];

function Run(sessionsService) {
    sessionsService.initialize();
}

function Config($routeProvider) {
    var initAuth = {
        auth: authFn
    };

    authFn.$inject = ['SessionsService'];

    function authFn(sessionsService) {
        return sessionsService.initAuthPromise;
    }

    $routeProvider
        .when('/home', {
            templateUrl: 'components/page/home.html',
            controller: 'HomeCtrl',
            controllerAs: 'ctrl',
            resolve: initAuth
        })
        .when('/help', {
            templateUrl: 'components/page/help.html',
            controller: 'HelpCtrl',
            resolve: initAuth
        })
        .when('/about', {
            templateUrl: 'components/page/about.html',
            controller: 'AboutCtrl',
            resolve: initAuth
        })
        .when('/contact', {
            templateUrl: 'components/page/contact.html',
            controller: 'ContactCtrl',
            resolve: initAuth
        })
        .when('/sign-up', {
            templateUrl: 'components/users/users-new.html',
            controller: 'UsersNewCtrl',
            controllerAs: 'ctrl',
            resolve: initAuth
        })
        .when('/users', {
            templateUrl: 'components/users/users-index.html',
            controller: 'UsersIndexCtrl',
            controllerAs: 'ctrl',
            resolve: initAuth
        })
        .when('/users/:id', {
            templateUrl: 'components/users/users-show.html',
            controller: 'UsersShowCtrl',
            controllerAs: 'ctrl',
            resolve: initAuth
        })
        .when('/users/:id/edit', {
            templateUrl: 'components/users/users-edit.html',
            controller: 'UsersEditCtrl',
            controllerAs: 'ctrl',
            resolve: initAuth
        })
        .when('/login', {
            templateUrl: 'components/sessions/sessions-new.html',
            controller: 'SessionsNewCtrl',
            controllerAs: 'ctrl',
            resolve: initAuth
        })
        .when('/logout', {
            templateUrl: 'components/sessions/sessions-delete.html',
            controller: 'SessionsDeleteCtrl',
            resolve: initAuth
        })
        .otherwise({
            redirectTo: '/home'
        });
}

})();
