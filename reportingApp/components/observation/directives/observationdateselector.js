angular.module('reportingApp').directive('observationdateselector', function() {
    var directive = {};

    directive.restrict = 'E';
    directive.templateUrl = "reportingApp/components/observation/directives/observationdateselector.html";

    directive.scope = {
      observation: '=',
    };

    return directive;
});