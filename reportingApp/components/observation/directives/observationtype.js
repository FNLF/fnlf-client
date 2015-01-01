angular.module('reportingApp').directive('observationtype', function(ObservationService) {
    var directive = {};

    directive.restrict = 'E';
    directive.templateUrl = "reportingApp/components/observation/directives/observationtype.html";

    directive.scope = {
      observation: '='
    };

 directive.link = function($scope, element, attrs){

 	$scope.available = ObservationService.getObservationTypes();

 };

    return directive;
});