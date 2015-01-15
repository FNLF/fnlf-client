angular.module('reportingApp').directive('summary', function (ObservationService, RestService) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "reportingApp/components/observation/directives/summary.html";

	directive.scope = {
		observation: '='

	};

	directive.link = function ($scope, element, attrs) {
		$scope.saveObservation = function () {
			RestService.updateObservation($scope.observation);
		};


	};

	return directive;
});