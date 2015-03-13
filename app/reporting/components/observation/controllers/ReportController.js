(function () {

	
	angular.module('reportingApp')
		.controller('ReportController', function ($scope, ObservationService,Definitions,$routeParams,$timeout, $rootScope) {
			
			
			var observationId = $routeParams.id;
			$scope.observation = {id:observationId};
			$scope.observationChanges = false;

			$scope.ui=$routeParams.ui;

			$scope.loadObservation = function(){
				$scope.observation = {};
				ObservationService.getObservationById(observationId, function(obs){

					$scope.observation = obs;
					ObservationService.initObservation($scope.observation);
					
					// Menus
					$rootScope.nav = {toolbar: [], menus: []}; //reset
					$rootScope.nav.brand = 'FNLF Observasjon #' + $scope.observation.id;
					$rootScope.nav.menus = [{title: 'Åpne i editor', link: '#!/observation/'+ $scope.observation.id}];
				});
			};
			$scope.loadObservation();
			
			
		});
	
})();