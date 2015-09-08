(function() {
"use strict";

angular
    .module('angularjsTutorial.users')
    .factory('UsersService', UsersService);

UsersService.$inject = ['$resource'];

function UsersService($resource) {
    var svc = $resource('/users/:id', {},
        { isAvailable: { method: 'GET', url: '/users/valid' } }
    );

    return svc;
}

})();