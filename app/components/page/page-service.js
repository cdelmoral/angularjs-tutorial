(function() {
"use strict";

angular
    .module('angularjsTutorial.page')
    .factory('PageSvc', PageSvc);

var BASE_TITLE = 'AngularJS Tutorial';

PageSvc.$inject = ['$rootScope'];

function PageSvc($rootScope) {
    var svc = this;
    svc.setPageTitle = setPageTitle;

    return svc;

    /** sets the full title of the page depending on the section */
    function setPageTitle(section) {
        if (section && section !== '') {
            $rootScope.title = section + ' - ' + BASE_TITLE;
        } else {
            $rootScope.title = BASE_TITLE;
        }
    }
}

})();