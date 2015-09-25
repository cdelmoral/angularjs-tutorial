(function() {
"use strict";

angular
    .module('angularjsTutorial.sessions')
    .factory('SessionsService', SessionsService);

SessionsService.$inject = ['$location', '$q', '$resource', '$rootScope', 'flash'];

function SessionsService($location, $q, $resource, $rootScope, flash) {
    var Sessions = $resource('/api/sessions', {}, {
        authenticate: { method: 'POST' },
        authenticated: { method: 'GET', url: '/api/sessions/authenticated' },
        logout: { method: 'DELETE', url: '/api/sessions/logout'}
    });

    var LOGGING_EVENT = 'LoggingEvent';

    var svc = this;

    svc.initAuthPromise = null;
    svc.currentUser = null;

    svc.authenticate = authenticate;
    svc.logout = logout;
    svc.initialize = initialize;

    svc.LOGGING_EVENT = LOGGING_EVENT;

    return svc;

    function initialize() {
        var defer = $q.defer();
        Sessions.authenticated(function(user) {
            if (user && user.id) {
                svc.currentUser = user;
                $rootScope.$broadcast(LOGGING_EVENT);
            }

            defer.resolve();
        });

        svc.initAuthPromise = defer.promise;
    }

    function authenticate(user) {
        Sessions.authenticate(user, function(user) {
            if (user && user.id) {
                svc.currentUser = user;
                flash.success = 'Welcome!';
                $rootScope.$broadcast(LOGGING_EVENT);
                $location.path('/users/' + user.id).replace();
            } else {
                flash.error = 'Invalid login';
                $location.path('/login').replace();
            }
        });
    }

    function logout() {
        Sessions.logout();
        
        svc.currentUser = null;
        $rootScope.$broadcast(LOGGING_EVENT);
        $location.path('/home').replace();
    }
}

})();
