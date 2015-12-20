angular.module('reportingApp').directive('observationtype', function (Definitions) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "components/observation/directives/observationtype.html";

	directive.scope = {
		observation: '=',
		acl: '='
	};

	directive.link = function ($scope, element, attrs) {

		$scope.observationTypes = Definitions.getObservationTypes();
		
		
	};

	return directive;
});