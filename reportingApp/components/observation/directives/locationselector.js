angular.module('reportingApp').directive('locationselector', function () {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "reportingApp/components/observation/directives/locationselector.html";

	directive.scope = {
		observation: '='
	};

	directive.link = function ($scope, element, attrs) {

		$scope.locations = [];


	};

	return directive;
});