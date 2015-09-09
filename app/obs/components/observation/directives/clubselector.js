(function () {

	var clubselector = function (RestService, ObservationService, $rootScope) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "components/observation/directives/clubselector.html";

		directive.scope = {
			observation: '='
		};

		directive.link = function ($scope, element, attrs) {
			$scope.clubs = [];
			$scope.getClubs = function () {
				RestService.getClubs()
					.then(function (response) {
						$scope.clubs = response._items;
					});
			};
			$scope.getClubs();
			
			
			//Default club for user!
			RestService.getUser($rootScope.username).then(function(data) {
				
				if(typeof $scope.observation.club == 'undefined' && data.data.settings.default_club) {
					$scope.observation.club = data.data.settings.default_club;
				}
			});

		};
		return directive;
	};

	angular.module('reportingApp').directive('clubselector', clubselector);

})();