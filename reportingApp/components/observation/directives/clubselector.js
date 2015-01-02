(function () {

	var clubselector = function (ClubService, ObservationService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "reportingApp/components/observation/directives/clubselector.html";

		directive.scope = {
			observation: '='
		};

		directive.link = function ($scope, element, attrs) {

			$scope.clubs = [];
			$scope.getClubs = function () {

				return [{name: 'Voss Fallskjermklubb', id: 'F1'}, {
					name: 'Bergen Fallskjermklubb',
					id: 'F2'
				}, {name: 'Grenland Fallskjermklubb', id: 'F3'}];
				;
			};

			$scope.clubSelected = function ($item, $model) {
				console.log($scope.observation.club);
				console.log($scope.observation);
				$scope.observation.club = $item;

			};

		};

		return directive;
	};

	angular.module('reportingApp').directive('clubselector', clubselector);

})();