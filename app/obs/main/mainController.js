(function () {
	angular.module('reportingApp')
		.controller('MainController', function ($scope, $rootScope, ObservationService,RestService,$location, ngTableParams, Definitions,Functions,ObservationsTableService,ENV) {

			$rootScope.nav = {toolbar: [], menus: [], brand: []}; //reset
			$rootScope.nav.search = {show_ors: false, form: '', show: false}; //reset
			$rootScope.nav.brand = "FNLF ORS";
			
			$rootScope.nav.search.show_ors = false; // = '<searchform></searchform>';
			
			$rootScope.title = 'F/NLF - ORS oversikt';
			
			$scope.observation = {};
			
			$scope.observations = {};
			$scope.allObservations = {};
			
			$scope.observationTypes = Definitions.getObservationTypes();

			$scope.whatHappened ='';
			$scope.whatEmpty=false;
			$scope.whatTooLong=false;

			$scope.$watch('whatHappened',function(){
				$scope.whatOnSelect();
			});

			$scope.whatOnSelect = function(){
				console.log($scope.whatHappened+" updated");
				if($scope.whatHappened){
					$scope.whatEmpty=false;
					if($scope.whatHappened.split(' ').length >3){
						$scope.whatTooLong=true;
					}else{
						$scope.whatTooLong=false;
					}

				}

			};

			$scope.createObservation = function(){

				if(!$scope.whatHappened){
					$scope.whatEmpty=true;
				}else{
					if($scope.whatHappened.trim().length<2){
						$scope.whatEmpty=true;
					}else{
						$scope.whatEmpty=false;
					}
				}
					RestService.createObservation($scope.observation)
						.then(function(metadata){
							RestService.getObservation(metadata._id)
								.then(function(item){
									if(!$scope.whatEmpty){
										$scope.observation = item;
										$scope.observation.tags=[];
										$scope.observation.tags.push($scope.whatHappened);
										$scope.observation.components = [{what:$scope.whatHappened,sort:0,flags:{incident:true}}];

										ObservationService.updateObservation($scope.observation).then(function(){
											$location.path("/observation/"+item.id);
										});
										}else{
											$location.path("/observation/"+item.id);
										}

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