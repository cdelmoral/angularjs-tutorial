(function() {
angular
    .module('angularjsTutorial.common')
    .directive('atSubmit', atSubmit);

atSubmit.$inject = ['$parse'];

function atSubmit($parse) {
    var directive = {
        restrict: 'A',
        require: ['atSubmit', '?form'],
        controller: ctrlFunction,
        compile: compileFunction
    };

    ctrlFunction.$inject = ['$scope'];

    return directive;

    function ctrlFunction($scope) {
        var ctrl = this;
        var formCtrl = null;
        var attempted = false;

        ctrl.setFormCtrl = setFormCtrl;
        ctrl.needsAttention = needsAttention;
        ctrl.setAttempted = setAttempted;

        function setAttempted() {
            attempted = true;
        }

        function setFormCtrl(ctrl) {
            formCtrl = ctrl;
        }

        function needsAttention(fieldModelController) {
            if (!formCtrl) {
                return false;
            }

            if (fieldModelController) {
                return fieldModelController.$invalid && (fieldModelController.$dirty || attempted);
            } else {
                return formCtrl && formCtrl.$invalid && (formCtrl.$dirty || attempted);
            }
        }
    }

    function compileFunction(element, attrs, transclude) {
        var compile = {
            pre: preFunction,
            post: postFunction
        };

        return compile;

        function preFunction(scope, element, attrs, ctrls) {
            var submitCtrl = ctrls[0];
 
            var formCtrl = (ctrls.length > 1) ? ctrls[1] : null;
            submitCtrl.setFormCtrl(formCtrl);

            scope.at = scope.at || {};
            scope.at[attrs.name] = submitCtrl;
        }

        function postFunction(scope, element, attrs, ctrls) {
            var submitCtrl = ctrls[0];
            var formCtrl = (ctrls.length > 1) ? ctrls[1] : null;

            var fn = $parse(attrs.atSubmit);
            element.bind('submit', function(event) {
                scope.$apply(function() {
                    submitCtrl.setAttempted();
                });

                if (!formCtrl.$valid) {
                    return false;
                } else {
                    scope.$apply(function() {
                        fn(scope, { $event: event });
                    });
                }
            });
        }
    }
}

})();
