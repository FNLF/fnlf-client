angular.module("clubApp").controller("clubController",
							['$scope', '$http', 'clubService', '$timeout','$rootScope', '$window',
							function($scope, $http, clubService, $timeout, $rootScope, $window) {

	// Menus
	$rootScope.nav = {toolbar: [], menus: []}; //reset
	$rootScope.nav.brand = 'FNLF Klubb';

	$scope.clubs = [];

	$scope.getClubs = function(){
		return clubService.getClubs()
			.then(function(response){
				$scope.clubs = response._items;
			});
	};

	$scope.getClubs();

}]);
