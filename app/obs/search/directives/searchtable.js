angular.module('reportingApp').directive('searchtable', function () {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "/app/obs/search/directives/searchtable.html";

	directive.scope = {
		viewfn : '&'
	};

	directive.controller = function ($scope,$rootScope, ObservationService,SearchService,ObservationsTableService,Definitions,Functions,$routeParams,ngTableParams,$timeout){


		$scope.observations = [];
    			$scope.total = 0;
    			$scope.tableData=[];

    			$scope.filter={};
    			$scope.showFilter=false;



    			if($routeParams.tag) {
    				$scope.tags = SearchService.parseTagQuery($routeParams.tag);
    				$scope.tag = $scope.tags.join(',');

    				$scope.filter = SearchService.parseFilter($routeParams.tag);

    				if(Object.keys($scope.filter).length>0){
    					$scope.showFilter=true;
    				}
    			}

    			if($routeParams.flag){
    				$scope.flag = $routeParams.flag;
    				$scope.attributes={};
    				$scope.attributes[$scope.flag]=true;
    				$scope.filter[$scope.flag]=true;
    				$scope.showFilter=true;
    			}


    			if($routeParams.query){
    				$scope.query = decodeURIComponent($routeParams.query);
    			}

					if($routeParams.rawquery){
    				$scope.rawquery = decodeURIComponent($routeParams.rawquery);
						$scope.rawquery = unescape($scope.rawquery);
    			}
		


    			$scope.queryObj = SearchService.parseAdvancedSearchQuery($scope.query);

				var searchTableParams = ObservationsTableService.restoreParams({page: 1, count: 10, sorting: {id: 'desc'}},'searchTable');

    			$scope.tableParams = new ngTableParams( searchTableParams, {total: 1, getData: function($defer, params){
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

						if($scope.rawquery){
							searchParam = $scope.rawquery;
							searchFn = SearchService.searchRaw;
						}

    				searchFn(params.page(), params.count(),sortString,searchParam,$scope.filter)
    					.then(function(data){
    						var meta = data._meta;
    						params.total(meta.total);
    						$scope.total = meta.total;
    						$scope.tableData = data._items;
    						$defer.resolve(data._items);
								ObservationsTableService.storeParams(params,'searchTable');
								$scope.searchError = null;
    					},
    					function(error){
    						console.log(error);
								$scope.searchError = error;

    					});

    			}});

    			$scope.viewObservation = function (observation) {
					if(!angular.isUndefined($scope.viewfn)){
						$scope.viewfn()(observation);
					}

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



	};

	directive.link = function ($scope, element, attrs) {

	};

	return directive;
});
