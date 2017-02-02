(function() {

	var main = angular.module('main', [ 'ngRoute', 'ui.bootstrap', 'ngSanitize', 'ngCookies', 'angular-loading-bar','fnlf-login', 'angled-navbar.directives','config', 'fnlf-services' ]);

	main.config([ 'cfpLoadingBarProvider',
			function(cfpLoadingBarProvider) {
				cfpLoadingBarProvider.includeBar = true;
				cfpLoadingBarProvider.includeSpinner = true;
			} ]);
	
	angular.module("main").controller("mainController", 
			['$scope', '$rootScope','$window', 'Appswitcher', 'RestService','$http','ENV',
			function($scope, $rootScope,$window, Appswitcher, RestService, $http,ENV) {

			$window.ga('create', ENV.googleAnalyticsId, 'auto');
			$window.ga('send', 'pageview', '/');


		// Menus
		Appswitcher.getApps();
		$rootScope.nav = {toolbar: [], menus: []}; //reset
		$rootScope.nav.brand = 'FNLF Tjenester';


			}]);

})();