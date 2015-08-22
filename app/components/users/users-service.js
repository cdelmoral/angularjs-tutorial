(function() {
"use strict";

angular
    .module('angularjsTutorial.users')
    .factory('UsersService', UsersService);

UsersService.$inject = ['$http'];

function UsersService($http) {
    var svc = this;
    svc.getUserById = getUserById;

    return svc;

    /* Gets user by id */
    function getUserById(userId) {
        return $http.get('/users/' + userId);
    }
}

})();