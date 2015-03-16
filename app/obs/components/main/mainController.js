(function () {
	/**
	 *
	 * @author: Tore Buer, s180346
	 * @author: Eivind Jacobsen, s173466
	 * @author: Morten Kristoffersen, s169440
	 *
	 * @since may.26.2014
	 *
	 */
	angular.module('reportingApp')
		.controller('MainController', function ($scope,$rootScope,ObservationService,RestService,$location, ngTableParams, Definitions, $filter) {
			
			$rootScope.nav = {toolbar: [], menus: [], brand: []}; //reset
			$rootScope.nav.brand = "FNLF Observasjonsregistrering";
			
			$scope.observation = {};
			
			$scope.observations = {};
			$scope.allObservations = {};
			
			$scope.observationTypes = Definitions.getObservationTypes();

			$scope.resolveObservationType = function(id) {
				
				return Definitions.resolveObservationTypes(id);
			};
			$scope.resolveWorkflowState = function(state) {
				
				return Definitions.resolveObservationWorkflowState(state);
			};
			
			
			$scope.editObservation = function(_id){
				console.log("Edit");
				RestService.getObservation(_id).success(function(item){

					$scope.observation = item;
					ObservationService.setObservation($scope.observation);

					if($scope.observation.workflow.state == 'closed') {
						$location.path("/observation/report/"+item.id);
					}
					else {
						$location.path("/observation/"+item.id);
					}
				});

			};

			$scope.createObservation = function(){
				console.log("Create");
				
				//if(club.ci) $scope.observation.organization.ci = club.ci;
				//if(club.ot) $scope.observation.organization.ot = club.ot;
				
				//To be filled in!
				/**
				$scope.observation.organization.plane = '';
				$scope.observation.organization.hm = '';
				$scope.observation.organization.hl = '';
				$scope.observation.organization.hfl = [];
				**/
				
				console.log($scope.observation);
				RestService.createObservation($scope.observation).success(function(metadata){
					console.log("Save");
					RestService.getObservation(metadata._id).success(function(item){
						console.log(item);
						$scope.observation = item;
						console.log("Set");
						$location.path("/observation/"+item.id);
					});

				});


			};

			$scope.getObservations = function(){
				var userName = $rootScope.username;
				RestService.getObservations(userName)
					.success(function(data){
						$scope.observations = data._items;
						
						$scope.tableMyObservations = new ngTableParams({
					        page: 1,            // show first page
					        count: 10,           // count per page
					        sorting: {
					            name: 'asc'     // initial sorting
					        }
					    }, {
					        total: $scope.observations.length, // length of data
					        getData: function($defer, params) {
					        	var filteredData = params.filter() ? $filter('filter')($scope.observations, params.filter()) : $scope.observations;
					            var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
					            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					            params.settings({ counts: orderedData.length > 10 ? [10, 25, 50] : []});
					        }
					    });
						
						
					});

			};
			
			$scope.getAllObservations = function(){
				RestService.getAllObservations()
				.success(function(r){

					var data = r._items
					.filter(function(it){
						if(it.id){
							
							return true;
						}
						return false;
					});
					
					$scope.tableParams = new ngTableParams({
				        page: 1,            // show first page
				        count: 5,           // count per page
				        sorting: {
				            name: 'asc'     // initial sorting
				        }
				    }, {
				        total: data.length, // length of data
				        getData: function($defer, params) {
				        	var filteredData = params.filter() ? $filter('filter')(data, params.filter()) : data;
				            var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				            params.settings({ counts: orderedData.length > 10 ? [10, 25, 50] : []});
				        }
				    });

					
				});
				
			};
			
			$scope.getObservationsTodo = function(){
				RestService.getWorkflowTodo()
				.success(function(r){
					
					var data = r._items
					.filter(function(it){
						if(it.id){
							
							return true;
						}
						return false;
					});
					
					$scope.todoTable = new ngTableParams({
						page: 1,            // show first page
						count: 5, // count per page
						counts: [], 
						sorting: {
							name: 'asc'     // initial sorting
						}
					}, {
						total: data.length, // length of data
						getData: function($defer, params) {
							var filteredData = params.filter() ? $filter('filter')(data, params.filter()) : data;
							var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
							$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
							params.settings({ counts: orderedData.length > 10 ? [10, 25, 50] : []});
						}
					});
					
					
				});
				
			};
			
			$scope.goToPage = function (url) {
				$location.path(url);
			};


		    
			
		});

})();