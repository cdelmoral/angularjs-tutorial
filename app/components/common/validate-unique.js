(function() {
angular
    .module('angularjsTutorial.common')
    .directive('atValidateUnique', atValidateUnique);

atValidateUnique.$inject = ['$parse', '$q', 'UsersService'];

function atValidateUnique($parse, $q, usersService) {
    var directive = {
        restrict: 'A',
        require: 'ngModel',
        link: linkFunction
    };

    return directive;

    function linkFunction(scope, element, attrs, ctrl) {
        ctrl.$asyncValidators.atValidateUnique = validateUnique;

        function validateUnique(modelValue, viewValue) {
            var defer = $q.defer();
            var value = modelValue || viewValue;

            var fn = $parse(attrs.atValidateUnique);
            fn(scope, { value: value }).then(function() {
                defer.resolve();
            }, function() {
                defer.reject();
            });

            return defer.promise;
        }
    }
}

})();
