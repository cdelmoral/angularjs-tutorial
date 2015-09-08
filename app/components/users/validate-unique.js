(function() {
angular
    .module('angularjsTutorial.users')
    .directive('atValidateUnique', atValidateUnique);

atValidateUnique.$inject = ['$q', 'UsersService'];

function atValidateUnique($q, usersService) {
    var directive = {
        restrict: 'A',
        require: 'ngModel',
        link: linkFunction
    };

    return directive;

    function linkFunction(scope, element, attrs, ctrl) {
        ctrl.$asyncValidators.atValidateUnique = validateUnique;
        var query = attrs.name;

        function validateUnique(modelValue, viewValue) {
            var value = modelValue || viewValue;
            var params = {};
            params[query] = value;
            var defer = $q.defer();

            usersService.isAvailable(params, function(res) {
                if (res && res.valid) {
                    defer.resolve();
                } else {
                    defer.reject();
                }
            });

            return defer.promise;
        }
    }
}

})();
