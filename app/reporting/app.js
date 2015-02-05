/**
 *
 * @author: Tore Buer, s180346
 * @author: Eivind Jacobsen, s173466
 * @author: Morten Kristoffersen, s169440
 *
 * @since may.26.2014
 *
 */
(function () {

	var reportingApp = angular.module('reportingApp', 
			['ngRoute', 'ui.select', 'ngSanitize', 'ngCookies',
			 'ui.bootstrap',
			 //'ui.bootstrap.alert','ui.bootstrap.collapse','ui.bootstrap.datepicker', 'ui.bootstrap.typeahead',
			 'angular-loading-bar', 'fnlf-login', 
			 'mgcrea.ngStrap.modal', 'mgcrea.ngStrap.aside'/*,'ngMockE2E'*/]);

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