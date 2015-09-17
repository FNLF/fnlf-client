(function () {

	
	angular.module('reportingApp')
		.controller('SearchController', function ($scope,$rootScope, ObservationService,ObservationsTableService,Definitions,Functions,$routeParams,ngTableParams) {

			$rootScope.nav = {toolbar: [], menus: [], brand: []}; //reset
			$rootScope.nav.brand = "FNLF Observasjonsregistrering";

			if($routeParams.tag) {
				$scope.tag = decodeURIComponent($routeParams.tag);
			}
			$scope.flag = $routeParams.flag;
			$scope.observations = [];
			$scope.total = 0;


			if($scope.flag) {
				$scope.attributes={};
				$scope.attributes[$scope.flag]=true;

			}



			var flattenComponentWhat = function(observation){
				return observation.components.map(function(c){
					return Functions.capitalizeFirstLetter(c.what);
				});
			};

			var flattenComponentTags = function(observation){
				var tags = [];

				angular.forEach(observation.components, function(c){
					angular.forEach(c.tags,function(t){
						tags.push(Functions.capitalizeFirstLetter(t));
					});
				});

				return tags;
			};


			var flattenAttributes = function(observation){

				var attributes = {};
				angular.forEach(observation.components, function(c){
					angular.forEach(c.attributes,function(v,k){
						if(v){
							attributes[k]=v;
						}

					});
				});
				return attributes;
			};


			$scope.tableParams = new ngTableParams({page: 1, count: 10, sorting: {id: 'desc'}} , {total: 1, getData: function($defer, params){
				var sortString = ObservationsTableService.sortStringFromParams(params);

				var searchParam = $scope.tag;
				var searchFn = ObservationService.searchByTag;
				if($scope.flag){
					searchParam = $scope.flag;
					searchFn = ObservationService.searchByFlag;
				}

				searchFn(params.page(), params.count(),sortString,searchParam)
					.then(function(data){
						var meta = data._meta;
						params.total(meta.total);
						$scope.total = meta.total;

						angular.forEach(data._items,function(obs){
							obs.flattenedWhats = flattenComponentWhat(obs);
							obs.flattenedFlags = flattenAttributes(obs);
							obs.flattenedTags = flattenComponentTags(obs);
						});

						$defer.resolve(data._items);
					},
					function(error){
						console.log(error);
					});

			}});

			$scope.editObservation = function (_id) {
				ObservationService.editObservation(_id);
			};

			$scope.componentTitles = {};

			$scope.components = function(observation){
				if($scope.componentTitles[observation.id]){
					return $scope.componentTitles[observation.id];
				}
				angular.forEach(observation.components,function(c){
					$scope.componentTitles.push(c.what);
				});
				return $scope.componentTitles;
			};

			$scope.flags = function(observation){
				var attributes = {};


				return attributes;
			};


		});
	
})();