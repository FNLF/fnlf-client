angular.module('reportingApp').directive('involvedpersonsummary', function (RestService) {
    var directive = {};

    directive.restrict = 'E';
    directive.templateUrl = "involved/directives/involvedpersonsummary.html";

    directive.scope = {
        person: '=',
    };

    directive.link = function ($scope, element, attrs) {


    };

    return directive;
});
