angular.module('reportingApp').directive('summary', function (ObservationService, RestService) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "components/observation/directives/summary.html";

	directive.scope = {
		observation: '='

	};

	directive.link = function ($scope, element, attrs) {



	};

	return directive;
});