(function() {
"use strict";

angular
    .module('angularjsTutorial.sessions')
    .factory('SessionsService', SessionsService);

SessionsService.$inject = ['$location', '$resource', 'flash'];

function SessionsService($location, $resource, flash) {
    var Sessions = $resource('/api/sessions', {},
        { authenticate: { method: 'POST' } }
    );

    var svc = this;

    svc.authenticate = authenticate;

    return svc;

    function authenticate(user) {
        Sessions.authenticate(user, function(user) {
            if (user && user.name && user.id) {
                flash.success = 'Welcome ' + user.name;
                $location.path('/users/' + user.id).replace();
            } else {
                flash.error = 'Invalid login';
                $location.path('/login').replace();
            }
        });
    }

    function login(sessionId) {
        $cookies.put('session_id', sessionId);
    }
}

})();
