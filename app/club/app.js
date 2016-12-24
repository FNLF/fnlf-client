(function() {

	var clubApp = angular.module('clubApp', [ 'ngRoute', 'ui.bootstrap', 'ui.select', 'ngSanitize', 'ngCookies', 
	                                                'angular-loading-bar',
	                                                'fnlf-login','imageupload', 'resolve', 'angled-navbar.directives','ngMap']);

	clubApp.config([ 'cfpLoadingBarProvider',
			function(cfpLoadingBarProvider) {
				cfpLoadingBarProvider.includeBar = true;
				cfpLoadingBarProvider.includeSpinner = true;
			} ]);

})();

angular.module("clubApp").controller("locationsController",
							['$scope', '$http', 'clubService', '$timeout','$rootScope', '$window','$location',
							function($scope, $http, clubService, $timeout, $rootScope, $window, $location) {

	// Menus
	$rootScope.nav = {toolbar: [], menus: []}; //reset
	$rootScope.nav.brand = 'FNLF Klubb';

	$scope.zoom=7;
	$scope.coords=[];

	if(angular.isUndefined($location.search().club)){
		$rootScope.$watch('default_club',function(){
			$scope.selected_club = $rootScope.default_club;
		});
	}else{
		$scope.selected_club = $location.search().club;
	}

	$scope.getClubLocations = function(){

		clubService.getClubLocations($scope.selected_club).then(function(response){
    		if(response.locations) {

				var filteredLocations = response.locations
					.filter(function(l){
						return typeof l =='object' && typeof l.geo !='undefined' && typeof l.geo.coordinates != 'undefined';
					});
					console.log(filteredLocations);
				if(filteredLocations.length > 0){
					$scope.loc = filteredLocations[0];
                	$scope.coords=[$scope.loc.geo.coordinates[0],$scope.loc.geo.coordinates[1]];
                    $scope.clubLocations = filteredLocations;
				}

			}

    	});

	};

	var move = function(array, oldIndex, newIndex) {

			array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
			return array;
	}

	$scope.setAsDefault = function(loc){
		var index = $scope.clubLocations.indexOf(loc);
		move($scope.clubLocations,index,0);
	}

	$scope.saveClubLocations = function(){

		clubService.getClubLocations($scope.selected_club).then(function(response){
			clubService.saveClubLocations($scope.clubLocations, response._etag,response._id).then(function(response) {
				$scope.loc = null;
			});
    	});
	};

	$scope.removeLocation = function(location){
		var index = $scope.clubLocations.indexOf(location);
		if(index >-1){
			$scope.clubLocations.splice(index,1);
		}
		$scope.loc = null;
	};

	$scope.rowClicked = function(location){

		$scope.loc=location;
		$scope.coords=[$scope.loc.geo.coordinates[0],$scope.loc.geo.coordinates[1]];
		$scope.zoom=13;
	};


	$scope.dragMarker = function(event,location){

		$scope.loc.geo.coordinates[0]=event.latLng.lat();
		$scope.loc.geo.coordinates[1]=event.latLng.lng();
		$scope.coords=[$scope.loc.geo.coordinates[0],$scope.loc.geo.coordinates[1]];


	};
	$scope.clickRedMarker = function(event,location){
		$scope.zoom=13;
		$scope.coords=[$scope.loc.geo.coordinates[0],$scope.loc.geo.coordinates[1]];

	};

	$scope.clickMarker = function(event,location){

		$scope.loc=location;
		$scope.zoom=13;
		$scope.coords=[$scope.loc.geo.coordinates[0],$scope.loc.geo.coordinates[1]];
	};



}]);

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




angular.module("clubApp")
	   .service("clubService",['$http','$q','$rootScope', function($http, $q, $rootScope) {
							
			var urlBase = '/api/v1';

		   var config = {headers: {
					'Accept': 'application/json'
				}
			};


			this.getClubLocations = function (clubId) {

				return $http.get(urlBase+'/clubs/' + clubId + '?projection={"locations": 1}' ,config).then(handleSuccess, handleError);
			};

			this.saveClubLocations = function(locations, etag,id) {
				config.headers['If-Match'] = etag;
				config.headers['Content-Type'] = 'application/json';
				return $http({ method: 'PATCH', url: urlBase+'/clubs/' + id, data: {locations: locations}, headers: config.headers});
			};

			this.getClubs = function() {

				var request = $http({
					method : "get",
					url : urlBase + '/clubs/',
				});
				return (request.then(handleSuccess, handleError));

			};

			this.getClubLogo = function(clubId) {


				var request = $http({
					method : "get",
					url : urlBase + '/clubs/' + clubId +'?projection={\"logo\": 1}',
				});
				return (request.then(handleSuccess, handleError));
				
			};
	
			// I transform the error response, unwrapping the
			// application dta from
			// the API response payload.
			function handleError(response) {
				// The API response from the server should be
				// returned in a
				// normalized format. However, if the request
				// was not handled by the
				// server (or what not handles properly - ex.
				// server error), then we
				// may have to normalize it on our end, as best
				// we can.
				console.log(response);
				if (!angular.isObject(response.data) || !response.data.message) {
					return ($q.reject("An unknown error occurred."));
				}
				// Otherwise, use expected error message.
				return ($q.reject(response.data.message));
			}
			// I transform the successful response, unwrapping
			// the application data
			// from the API response payload.
			function handleSuccess(response) {
				return (response.data);
			}
	
		} ]);