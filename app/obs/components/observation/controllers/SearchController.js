(function () {


	angular.module('reportingApp')
		.controller('SearchController', function ($scope,$rootScope, ObservationService,SearchService,ObservationsTableService,Definitions,Functions,$routeParams,ngTableParams,$timeout) {

			$rootScope.nav = {toolbar: [], menus: [], brand: []}; //reset
			$rootScope.nav.brand = "FNLF ORS";


			$scope.observations = [];
			$scope.total = 0;
			$scope.tableData=[];

			$scope.allacl={w:true};

			if($routeParams.tag) {
				$scope.tags = SearchService.parseTagQuery($routeParams.tag);
				$scope.tag = $scope.tags.join(',');
				$rootScope.title = 'ORS søk: ' + $scope.tag;
				$scope.filter = SearchService.parseFilter($routeParams.tag);

				console.log('Getting from '+$routeParams.tag);
				console.log($scope.filter);
			}

			if($routeParams.flag){
				$scope.flag = $routeParams.flag;
				$scope.attributes={};
				$scope.attributes[$scope.flag]=true;
				$rootScope.title = 'ORS søk: ' + $scope.flag;
			}

			if($routeParams.query){
				$scope.query = decodeURIComponent($routeParams.query);
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

				searchFn(params.page(), params.count(),sortString,searchParam,$scope.filter)
					.then(function(data){
						var meta = data._meta;
						params.total(meta.total);
						$scope.total = meta.total;
						$scope.tableData = data._items;
						$defer.resolve(data._items);

					},
					function(error){
						console.log(error);
					});

			}});

			$scope.viewObservation = function (observation) {
				$scope.observation = undefined;
				$timeout(function(){
					$scope.observation=observation;
				},20);
			};

			$scope.hideObservation = function(){
				$scope.observation = undefined;
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