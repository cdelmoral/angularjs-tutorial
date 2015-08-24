(function() {
"use strict";

angular
    .module('angularjsTutorial.users')
    .factory('UsersService', UsersService);

UsersService.$inject = ['$http'];

function UsersService($http) {
    var svc = this;
    svc.getUserById = getUserById;
    svc.getUsers = getUsers;

    return svc;

    /* Gets the index of users */
    function getUsers() {
        return $http.get('/users');
    }

    /* Gets user by id */
    function getUserById(userId) {
        return $http.get('/users/' + userId);
    }
}

})();