(function() {

	var clubApp = angular.module('clubApp', [ 'ngRoute', 'ui.bootstrap', 'ui.select', 'ngSanitize', 'ngCookies', 
	                                                'angular-loading-bar',
	                                                'fnlf-login','imageupload', 'resolve', 'angled-navbar.directives']);

	clubApp.config([ 'cfpLoadingBarProvider',
			function(cfpLoadingBarProvider) {
				cfpLoadingBarProvider.includeBar = true;
				cfpLoadingBarProvider.includeSpinner = true;
			} ]);

})();

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