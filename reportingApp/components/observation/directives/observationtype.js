angular.module('reportingApp').directive('observationtype', function (Definitions) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "reportingApp/components/observation/directives/observationtype.html";

	directive.scope = {
		observation: '='
	};

	directive.link = function ($scope, element, attrs) {

		$scope.observationTypes = Definitions.getObservationTypes();
		$scope.observationTypeOptions = Definitions.getObservationTypeOptions();
	};

	return directive;
});