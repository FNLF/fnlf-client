(function() {

	var main = angular.module('main', [ 'ngRoute', 'ui.bootstrap', 'ngSanitize', 'ngCookies', 'angular-loading-bar','fnlf-login', 'angled-navbar.directives' ]);

	main.config([ 'cfpLoadingBarProvider',
			function(cfpLoadingBarProvider) {
				cfpLoadingBarProvider.includeBar = true;
				cfpLoadingBarProvider.includeSpinner = true;
			} ]);
	
	angular.module("main").controller("mainController", 
			['$scope', '$rootScope',
			function($scope, $rootScope) {

		// Menus
		$rootScope.nav = {toolbar: [], menus: []}; //reset
		$rootScope.nav.brand = 'FNLF Elektroniske Tjenester';


			}]);

})();