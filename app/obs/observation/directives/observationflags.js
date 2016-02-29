angular.module('reportingApp').directive('observationflags', function (Definitions) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "observation/directives/observationflags.html";

	directive.scope = {
		observation: '=',
		acl: '='
	};

	directive.link = function ($scope, element, attrs) {

//		$scope.observationTypes = Definitions.getObservationTypes();
//		$scope.observationTypeOptions = Definitions.getObservationTypeOptions();
		
	};

	return directive;
});