(function () {


	angular.module('reportingApp')
		.controller('SearchController', function ($scope,$rootScope, ObservationService,SearchService,ObservationsTableService,Definitions,Functions,$routeParams,ngTableParams) {

			$rootScope.nav = {toolbar: [], menus: [], brand: []}; //reset
			$rootScope.nav.brand = "FNLF ORS";

			
			$scope.observations = [];
			$scope.total = 0;

			if($routeParams.tag) {
				$scope.tag = $routeParams.tag;
				$scope.tags = SearchService.parseTagQuery($routeParams.tag);
				$rootScope.title = 'ORS søk: ' + $scope.tag;
			}

			if($routeParams.flag){
				$scope.flag = $routeParams.flag;
				$scope.attributes={};
				$scope.attributes[$scope.flag]=true;
				$rootScope.title = 'ORS søk: ' + $scope.flag;
			}

			if($routeParams.query){
				$scope.query = $routeParams.query;
				$rootScope.title = 'ORS søk: ' + $scope.query;
			}
			
			
			
			$scope.queryObj = SearchService.parseAdvancedSearchQuery($scope.query);

			$scope.tableParams = new ngTableParams({page: 1, count: 10, sorting: {id: 'desc'}} , {total: 1, getData: function($defer, params){
				var sortString = ObservationsTableService.sortStringFromParams(params);

				var searchParam = $scope.tags;
				var searchFn = SearchService.searchByTag;
				if($scope.flag){
					searchParam = $scope.flag;
					searchFn = SearchService.searchByFlag;
				}
                if($scope.query){
                    searchParam = $scope.queryObj;
                    searchFn = SearchService.searchAdvanced;
                }

				searchFn(params.page(), params.count(),sortString,searchParam)
					.then(function(data){
						var meta = data._meta;
						params.total(meta.total);
						$scope.total = meta.total;

						angular.forEach(data._items,function(obs){
							obs.flattenedWhats = SearchService.flattenComponentWhat(obs);
							obs.flattenedFlags = SearchService.flattenAttributes(obs);
							obs.flattenedTags = SearchService.flattenComponentTags(obs);
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