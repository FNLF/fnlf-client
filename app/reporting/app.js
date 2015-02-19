/**
 *
 *
 */
(function () {

	var reportingApp = angular.module('reportingApp', 
			['ngRoute', 'ngSanitize', 'ngCookies',
			 'ui.bootstrap', 'ui.select',
			 //'ui.bootstrap.alert','ui.bootstrap.collapse','ui.bootstrap.datepicker', 'ui.bootstrap.typeahead',
			 'angular-loading-bar', 
			 'mgcrea.ngStrap.modal', 'mgcrea.ngStrap.aside',
			 'fnlf-login', 'resolve',
			 'angularFileUpload',
			 /*,'ngMockE2E'*/
			 ]);

	reportingApp.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeBar = true;
		cfpLoadingBarProvider.includeSpinner = true;
	}]);
	
	reportingApp.run(function ($rootScope, $location, $cookieStore) {

		$rootScope.$on('$viewContentLoaded', function () {
			delete $rootScope.error;
		});

		$rootScope.initialized = true;
	});
	
	


})();