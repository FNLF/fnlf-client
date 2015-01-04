(function () {

	var clubselector = function (RestService, ObservationService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "reportingApp/components/observation/directives/clubselector.html";

		directive.scope = {
			observation: '='
		};

		directive.link = function ($scope, element, attrs) {
			$scope.clubs = [];
			$scope.getClubs = function () {
				 RestService.getClubs()
					.success(function(response){
						$scope.clubs = response._items;
					});
			};
			$scope.getClubs();

		};
		return directive;
	};

	angular.module('reportingApp').directive('clubselector', clubselector);

})();