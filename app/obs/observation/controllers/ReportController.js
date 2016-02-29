(function () {

	
	angular.module('reportingApp')
		.controller('ReportController', function ($scope, ObservationService,Definitions,$routeParams,$timeout, $rootScope, $location) {
			
			
			var observationId = $routeParams.id;
			$scope.observation = {id:observationId};
			$scope.observationChanges = false;

			$scope.ui=$routeParams.ui;
			
			$rootScope.title = 'F/NLF - ORS rapportvisning #' + $routeParams.id;

			$rootScope.nav = {toolbar: [], menus: []}; //reset
			$rootScope.nav.brand = 'FNLF ORS #' + $routeParams.id;

			$rootScope.openInEditMode = function(){
				$location.path('/observation/'+ $routeParams.id);
			};
			$rootScope.nav.toolbar[2] = {tooltip:'Åpne i editor',text:'Åpne i editor',btn_class:'default',icon:'edit',onclick:$rootScope.openInEditMode};

			$scope.getAcl = function(){
				ObservationService.getAcl(observationId)
					.then(function(acl){
						$scope.acl=acl;
					});
			};
			
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
						
						$scope.getAcl();

					})
					.catch(function(error){
						console.log(error);
						$rootScope.error='Enten så mangler du tilgang til observasjonen, eller så eksisterer den ikke. Prøv igjen <a href="/app/obs#!/observation/report/' + observationId +'">#'+observationId+'</a>';
					});


			};
			$scope.loadObservation();
			
			
		});
	
})();