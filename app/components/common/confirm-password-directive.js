(function() {
angular
    .module('angularjsTutorial.common')
    .directive('atConfirmPassword', atConfirmPassword);

function atConfirmPassword() {
    var directive = {
        require: 'ngModel',
        scope: {
            password: '=atConfirmPassword'
        },
        link: linkFunction
    };

    return directive;

    function linkFunction(scope, element, attrs, ctrl) {
        ctrl.$validators.atConfirmPassword = validateConfirmPassword;

        scope.$watch('password', function() {
            ctrl.$validate();
        });

        function validateConfirmPassword(modelValue, viewValue) {
            var value = modelValue || viewValue;

            return value === scope.password;
        }
    }
}

})();
