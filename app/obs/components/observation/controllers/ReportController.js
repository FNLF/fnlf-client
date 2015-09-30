(function () {

	
	angular.module('reportingApp')
		.controller('ReportController', function ($scope, ObservationService,Definitions,$routeParams,$timeout, $rootScope, $location) {
			
			
			var observationId = $routeParams.id;
			$scope.observation = {id:observationId};
			$scope.observationChanges = false;

			$scope.ui=$routeParams.ui;
			
			$rootScope.title = 'ORS rapportvisning #' + $routeParams.id;

			$rootScope.nav = {toolbar: [], menus: []}; //reset
			$rootScope.nav.brand = 'FNLF ORS #' + $routeParams.id;

			$rootScope.openInEditMode = function(){
				$location.path('/observation/'+ $routeParams.id);
			};
			$rootScope.nav.toolbar[2] = {tooltip:'Åpne i editor',text:'Åpne i editor',btn_class:'default',icon:'square-o',onclick:$rootScope.openInEditMode};

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


					})
					.catch(function(error){
						console.log(error);
						$rootScope.error=error;
					});


			};
			$scope.loadObservation();
			
			
		});
	
})();