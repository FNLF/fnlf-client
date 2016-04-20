(function () {


	angular.module('reportingApp')
		.controller('SearchController', function ($scope,$rootScope, ObservationService,SearchService,ObservationsTableService,Definitions,Functions,$routeParams,ngTableParams,$timeout) {

			$rootScope.nav = {toolbar: [], menus: [], brand: []}; //reset
			$rootScope.nav.brand = "FNLF ORS";


			$scope.observations = [];
			$scope.total = 0;
			$scope.tableData=[];

			$scope.filter={};
			$scope.showFilter=false;
			$rootScope.title = 'F/NLF - ORS søk';


			if($routeParams.tag) {
				$scope.tags = SearchService.parseTagQuery($routeParams.tag);
				$scope.tag = $scope.tags.join(',');
				$rootScope.title = 'F/NLF - ORS søk: ' + $scope.tag;
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
				$rootScope.title = 'F/NLF - ORS søk: ' + $scope.flag;
				$scope.showFilter=true;
			}


			if($routeParams.query){
				$scope.query = decodeURIComponent($routeParams.query);
				$rootScope.title = 'F/NLF - ORS søk: ' + $scope.query;
			}


			$scope.viewObservation = function (observation) {
				$scope.observation = undefined;
				$timeout(function(){
					$scope.observation=observation;
				},20);
			};

			$scope.hideObservation = function(){
				$scope.observation = undefined;
			};

		});

})();