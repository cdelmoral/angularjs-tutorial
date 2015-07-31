(function() {
"use strict";

angular
    .module('angularjsTutorial.page')
    .factory('PageSvc', PageSvc);

var BASE_TITLE = 'AngularJS Tutorial';

function PageSvc() {
    var svc = this;
    svc.getPageTitle = getPageTitle;

    return svc;

    function getPageTitle(section) {
        if (section && section !== '') {
            return section + ' - ' + BASE_TITLE;
        } else {
            return BASE_TITLE;
        }
    }
}

})();