(function() {

	var main = angular.module('main', [ 'ngRoute', 'ui.bootstrap', 'ngSanitize', 'ngCookies', 'angular-loading-bar','fnlf-login' ]);

	main.config([ 'cfpLoadingBarProvider',
			function(cfpLoadingBarProvider) {
				cfpLoadingBarProvider.includeBar = true;
				cfpLoadingBarProvider.includeSpinner = true;
			} ]);

})();