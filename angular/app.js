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
		
		$rootScope.hasRole = function(role) {	

			if ($rootScope.user === undefined) {
				return false;
			}
			   if(role==='user')
    		     return true;
			if ($rootScope.user.roles[role] === undefined) {
				return false;
			}
			return $rootScope.user.roles[role];
		};
		
		$rootScope.logout = function() {
			delete $rootScope.user;
			delete $rootScope.authToken;
            $cookieStore.remove('authToken');
			$location.path("/login");
                        if(!$rootScope.rememberMe){
                            $cookieStore.remove('username');
                            $cookieStore.remove('password');
                            $cookieStore.remove('rememberMe');
                        }
		};
		

		var authToken = $cookieStore.get('authToken');
		if (authToken !== undefined) {
			UserService.tryLoginFromCookie();
		}
		
		$rootScope.initialized = true;
	});


