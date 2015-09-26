(function() {
"use strict";

angular
    .module('angularjsTutorial.users')
    .factory('UsersService', UsersService);

UsersService.$inject = ['$resource'];

function UsersService($resource) {
    var svc = $resource('/api/users/:id', null, {
            update: { method: 'PUT' },
            isAvailable: { method: 'GET', url: '/api/users/valid' }
        }
    );

    return svc;
}

})();
