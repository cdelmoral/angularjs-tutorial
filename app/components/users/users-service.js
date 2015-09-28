(function() {
"use strict";

angular
    .module('angularjsTutorial.users')
    .factory('UsersService', UsersService);

UsersService.$inject = ['$q', '$resource'];

function UsersService($q, $resource) {
    var svc = {};

    svc.createUser = createUser;
    svc.updateUser = updateUser;
    svc.getUsersIndex = getUsersIndex;
    svc.getUser = getUser;
    svc.userPath = userPath;
    svc.isNameUnique = isNameUnique;
    svc.isEmailUnique = isEmailUnique;

    // Private variables

    var Users = $resource('/api/users/:id', {}, {
            update: { method: 'PUT' },
            isNameAvailable: { method: 'GET', url: '/api/users/valid_name' },
            isEmailAvailable: { method: 'GET', url: '/api/users/valid_email' }
        }
    );

    return svc;

    function createUser(user) {
        return Users.save(user).$promise;
    }

    function updateUser(user) {
        return Users.update({ id: user.id }, user).$promise;
    }

    function getUsersIndex() {
        return Users.query();
    }

    function getUser(id) {
        return Users.get({ id: id });
    }

    function userPath(user) {
        if (user && user.id) {
            return '/users/' + user.id;
        }
    }

    function isNameUnique(name) {
        var defer = $q.defer();
        Users.isNameAvailable({ name: name }).$promise.then(function(res) {
            if (res && res.valid) {
                defer.resolve();
            } else {
                defer.reject();
            }
        });

        return defer.promise;
    }

    function isEmailUnique(email) {
        var defer = $q.defer();
        Users.isEmailAvailable({ email: email }).$promise.then(function(res) {
            if (res && res.valid) {
                defer.resolve();
            } else {
                defer.reject();
            }
        });

        return defer.promise;
    }
}

})();
