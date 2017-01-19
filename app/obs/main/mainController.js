(function () {
	angular.module('reportingApp')
		.controller('MainController', function ($scope, $rootScope, ObservationService,RestService,$location, ngTableParams, Definitions,Functions,ObservationsTableService,ENV, Appswitcher) {

			$rootScope.nav = {toolbar: [], menus: [], brand: []}; //reset
			$rootScope.nav.search = {show_ors: false, form: '', show: false}; //reset
			$rootScope.nav.brand = "FNLF ORS";

			$rootScope.nav.search.show_ors = false; // = '<searchform></searchform>';
			Appswitcher.getApps();
			$rootScope.title = 'F/NLF - ORS oversikt';

			$scope.observation = {};

			$scope.observations = {};
			$scope.allObservations = {};

			$scope.observationTypes = Definitions.getObservationTypes();

			$scope.createObservation = function(){

				RestService.createObservation($scope.observation)
					.then(function(metadata){

						RestService.getObservation(metadata._id)
							.then(function(item){

								$scope.observation = item;

								$location.path("/observation/"+item.id);
							});

					});
			};

			$scope.editObservation = function (_id) {
				ObservationService.editObservation(_id);
			};



			var myTableParams = ObservationsTableService.restoreParams({page: 1, count: 10, sorting: {id: 'desc'}},'myTableParams');
			$scope.tableMyObservations = new ngTableParams(myTableParams , {total: 1, getData: function($defer, params){

				var sortString = ObservationsTableService.sortStringFromParams(params);
				RestService.getObservations(params.page(), params.count(), sortString,$rootScope.username)
					.then(function(data){
						var meta = data._meta;
						params.total(meta.total);
						$defer.resolve(data._items);
						ObservationsTableService.storeParams(params,'myTableParams');
					});

			}});

			var todoTableParams = ObservationsTableService.restoreParams({page: 1, count: 10, sorting: {id: 'desc'}},'todoTableParams');

			$scope.todoTable = new ngTableParams(todoTableParams , {total: 1, getData: function($defer, params){
				var sortString = ObservationsTableService.sortStringFromParams(params);
				RestService.getWorkflowTodo(params.page(), params.count(), sortString)
					.then(function(data){
						var meta = data._meta;
						params.total(meta.total);
						$defer.resolve(data._items);
						ObservationsTableService.storeParams(params,'todoTableParams');
					});

			}});

			var allTableParams = ObservationsTableService.restoreParams({page: 1, count: 10, sorting: {id: 'desc'}, filter:{state:'closed'}},'allObservationsTable');
			$scope.tableParams = new ngTableParams( allTableParams , {total: 1, getData: function($defer, params){

				var sortString = ObservationsTableService.sortStringFromParams(params);
				var whereString = ObservationsTableService.whereStringFromParams(params);
				RestService.getAllObservations(params.page(), params.count(), sortString,whereString)
					.then(function(data){
							var meta = data._meta;
							params.total(meta.total);
							$defer.resolve(data._items);
							ObservationsTableService.storeParams(params,'allObservationsTable');
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