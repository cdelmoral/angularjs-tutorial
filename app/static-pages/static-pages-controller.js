(function() {
'use strict';

angular
    .module('angularjsTutorial.staticPages')
    .controller('StaticPagesCtrl', StaticPagesCtrl);

function StaticPagesCtrl() {
    var ctrl = this;

    ctrl.shouldBeFive = 5;
}

})();
