angular.module('reportingApp').directive('observationtype', function (ObservationService) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "reportingApp/components/observation/directives/observationtype.html";

	directive.scope = {
		observation: '='
	};

	directive.link = function ($scope, element, attrs) {

		$scope.observationTypes = ObservationService.getObservationTypes();
		$scope.observationTypeOptions = ObservationService.getObservationTypeOptions();
	};

	return directive;
});