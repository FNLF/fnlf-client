angular.module('reportingApp').directive('summary', function (ObservationService) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "reportingApp/components/observation/directives/summary.html";

	directive.scope = {
		observation: '='

	};

	directive.link = function ($scope, element, attrs) {


	};

	return directive;
});