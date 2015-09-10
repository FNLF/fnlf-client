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
		.controller('MainController', function ($scope,$rootScope,ObservationService,RestService,$location, ngTableParams, Definitions,ObservationsTableService) {
			
			$rootScope.nav = {toolbar: [], menus: [], brand: []}; //reset
			$rootScope.nav.brand = "FNLF Observasjoner";
			
			$scope.observation = {};
			
			$scope.observations = {};
			$scope.allObservations = {};
			
			$scope.observationTypes = Definitions.getObservationTypes();

			$scope.createObservation = function(){
				console.log("Create");

				console.log($scope.observation);
				RestService.createObservation($scope.observation)
					.then(function(metadata){
						console.log("Save");
						RestService.getObservation(metadata._id)
							.then(function(item){
							console.log(item);
							$scope.observation = item;
							console.log("Set");
							$location.path("/observation/"+item.id);
						});

				});
			};

			$scope.editObservation = function (_id) {
				ObservationService.editObservation(_id);
			};


			$scope.tableMyObservations = new ngTableParams({page: 1, count: 10, sorting: {id: 'desc'}} , {total: 1, getData: function($defer, params){

				var sortString = ObservationsTableService.sortStringFromParams(params);
				RestService.getObservations(params.page(), params.count(), sortString,$rootScope.username)
					.then(function(data){
						var meta = data._meta;
						params.total(meta.total);
						$defer.resolve(data._items);
					});

			}});

			$scope.todoTable = new ngTableParams({page: 1, count: 100, sorting: {id: 'desc'}} , {total: 1, getData: function($defer, params){
				var sortString = ObservationsTableService.sortStringFromParams(params);
				RestService.getWorkflowTodo(params.page(), params.count(), sortString)
					.then(function(data){
						params.total(data._items.length);
						$defer.resolve(data._items);
					});

			}});

			$scope.tableParams = new ngTableParams({page: 1, count: 10, sorting: {id: 'desc'}} , {total: 1, getData: function($defer, params){

				var filter = params.filter();
				console.log(filter);

				var sortString = ObservationsTableService.sortStringFromParams(params);
				var whereString = ObservationsTableService.whereStringFromParams(params);
				RestService.getAllObservations(params.page(), params.count(), sortString,whereString)
					.then(function(data){
						var meta = data._meta;
						params.total(meta.total);
						$defer.resolve(data._items);
					},
				function(error){
					console.log(error);
				});

			}});


			$scope.getTitles = function(){
				return ObservationsTableService.getTags();
			};

			$scope.getClubs = function(){
				return ObservationsTableService.getClubs();
			};


			$scope.getTypes = function(){
				return ObservationsTableService.getTypes();
			};

			$scope.getStates = function(){
				return ObservationsTableService.getWorkflowStates();
			};

			$scope.getRatings = function(){
				return ObservationsTableService.getRatings();
			};

			$scope.getYears = function(){
				return ObservationsTableService.getYears();
			};



		});

})();