(function () {

	
	angular.module('reportingApp')
		.controller('ReportController', function ($scope, ObservationService,Definitions,$routeParams,$timeout, $rootScope) {
			
			
			var observationId = $routeParams.id;
			$scope.observation = {id:observationId};
			$scope.observationChanges = false;

			$scope.ui=$routeParams.ui;
			
			$rootScope.title = 'ORS rapportvisning #' + $scope.observation.id;

			$scope.loadObservation = function(){
				$scope.observation = {};
				ObservationService.getObservationById(observationId)
					.then(function(obs){

						var components = obs.components;

						components.sort(function(a,b) {
							return a.order - b.order;
						});
						obs.components = components;

						$scope.observation = obs;
						ObservationService.initObservation($scope.observation);

						var start = moment($scope.observation._created);
						var stop = moment($scope.observation.workflow.last_transition);
						$scope.timeTaken = moment.duration(stop - start).humanize();

						// Menus
						$rootScope.nav = {toolbar: [], menus: []}; //reset
						$rootScope.nav.brand = 'FNLF Observasjon #' + $scope.observation.id;
						$rootScope.nav.menus = [{title: 'Åpne i editor', icon: 'fa-edit', link: '#!/observation/'+ $scope.observation.id}];
					})
					.catch(function(error){
						console.log(error);
						$rootScope.error=error;
					});


			};
			$scope.loadObservation();
			
			
		});
	
})();