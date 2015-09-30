(function() {
"use strict";

angular
    .module('angularjsTutorial.sessions')
    .factory('SessionsService', SessionsService);

SessionsService.$inject = ['$location', '$q', '$resource', '$rootScope', 'flash'];

function SessionsService($location, $q, $resource, $rootScope, flash) {
    var svc = this;

    svc.LOGGING_EVENT = 'LoggingEvent';

    svc.initAuthPromise = null;
    svc.currentUser = null;

    /** String for holding the attempt to access a unauthorized page. */
    svc.beforeLoginAttempt = null;

    svc.authenticate = authenticate;
    svc.logout = logout;
    svc.initialize = initialize;
    svc.requireLogin = requireLogin;

    // Private variables

    var Sessions = $resource('/api/sessions', {}, {
        authenticate: { method: 'POST' },
        authenticated: { method: 'GET', url: '/api/sessions/authenticated' },
        logout: { method: 'DELETE', url: '/api/sessions/logout'}
    });

    return svc;

    function authenticate(user) {
        var defer = $q.defer()
        Sessions.authenticate(user, function(user) {
            if (user && user.id) {
                svc.currentUser = user;
                $rootScope.$broadcast(svc.LOGGING_EVENT);
                defer.resolve(svc.currentUser);
            } else {
                defer.reject();
            }
        });
        return defer.promise;
    }

    function logout() {
        Sessions.logout();
        
        svc.currentUser = null;
        $rootScope.$broadcast(svc.LOGGING_EVENT);
        $location.path('/home').replace();
    }

    function requireLogin() {
        if (svc.currentUser === null) {
            svc.beforeLoginAttempt = $location.path();
            flash.error = 'You need to be logged in to access this page';
            $location.path('/login').replace();
        }
    }

    // Private methods

    function initialize() {
        var defer = $q.defer();
        Sessions.authenticated(function(user) {
            if (user && user.id) {
                svc.currentUser = user;
                $rootScope.$broadcast(svc.LOGGING_EVENT);
            }

            defer.resolve();
        });

        svc.initAuthPromise = defer.promise;
    }
}

})();
