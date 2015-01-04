angular.module('reportingApp').directive('locationselector', function (ClubService) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "reportingApp/components/observation/directives/locationselector.html";

	directive.scope = {
		observation: '='
	};

	directive.link = function ($scope, element, attrs) {

		$scope.locations = [];
		$scope.getLocations = function () {
			return [{name: 'Bømoen'}, {name: 'Stend'}, {name: 'Geiteryggen'}];
		};

		$scope.locations = $scope.getLocations();

	};

	return directive;
});