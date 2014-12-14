/**
*
* @author: Tore Buer, s180346
* @author: Eivind Jacobsen, s173466
* @author: Morten Kristoffersen, s169440
*
* @since may.26.2014
*
*/
var anomalyApp = angular.module('anomalyApp', [
    'ngRoute',
    'ngResource',
    'ui',
    'ngCookies',
    'angular-loading-bar'
]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = true;
}]);




anomalyApp.run(function($rootScope, $location, $cookieStore, UserService) {
		
		$rootScope.$on('$viewContentLoaded', function() {
			delete $rootScope.error;
		});

        UserService.tryLoginFromCookie();

		$rootScope.initialized = true;
	});


