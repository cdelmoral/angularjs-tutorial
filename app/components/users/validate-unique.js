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

        function validateUnique(modelValue, viewValue) {
            var value = modelValue || viewValue;
            var defer = $q.defer();

            usersService.isAvailable({name: value}, function(res) {
                if (res && res.available) {
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
