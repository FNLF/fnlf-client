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
							['$scope', '$http', 'clubService', '$timeout','$rootScope', '$window',
							function($scope, $http, clubService, $timeout, $rootScope, $window) {

	// Menus
	$rootScope.nav = {toolbar: [], menus: []}; //reset
	$rootScope.nav.brand = 'FNLF Klubb';

	$scope.zoom=7;

	$scope.getClubLocations = function(){

		clubService.getClubLocations().then(function(response){
    		$scope.loc = response.locations[0];
    		$scope.clubLocations = response.locations;
    	});

	};

	$scope.saveClubLocations = function(){

		clubService.getClubLocations().then(function(response){

    		var etag = response.etag;

				clubService.saveClubLocations($scope.clubLocations, etag,response._id).success(function(response) {
					console.log(response);
					$scope.clubLocations = response.locations;
				});

    	});

	};


		$scope.dragMarker = function(event,location){
			location.geo.coordinates[0]=event.latLng.k;
			location.geo.coordinates[1]=event.latLng.D;
			console.log(location.geo);

		};

		$scope.clickMarker = function(event,location){
			$scope.loc=location;
			$scope.zoom=13;
			$scope.location = location;
			$scope.nickname = location.nickname;
		};



}]);

angular.module("clubApp").controller("clubController", 
							['$scope', '$http', 'clubService', '$timeout','$rootScope', '$window',
							function($scope, $http, clubService, $timeout, $rootScope, $window) {
	
	// Menus
	$rootScope.nav = {toolbar: [], menus: []}; //reset
	$rootScope.nav.brand = 'FNLF Klubb';
	
	
}]);




angular.module("clubApp")
	   .service("clubService",['$http','$q','$rootScope', function($http, $q, $rootScope) {
							
			var urlBase = '/api/v1';

		   var config = {headers: {
					'Accept': 'application/json'
				}
			};

			this.getClubLocations = function () {
				return $http.get(urlBase+'/clubs/' + $rootScope.default_club + '?projection={"locations": 1}' ,config).then(handleSuccess, handleError);
			};

			this.saveClubLocations = function(locations, etag,id) {
				config.headers['If-Match'] = etag;
				config.headers['Content-Type'] = 'application/json';
				return $http({ method: 'PATCH', url: urlBase+'/clubs/' + id, data: {locations: locations}, headers: config.headers});
			};
			
			this.getClubLogo = function() {
				
				var request = $http({
					method : "get",
					url : urlBase + '/clubs/' + $rootScope.default_club +'?projection={\"logo\": 1}',
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
				console.log(response.data);
				return (response.data);
			}
	
		} ]);