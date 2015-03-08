(function() {

	var reportingApp = angular.module('reportingApp', [ 'ngRoute', 'ui.bootstrap',
			'ui.select', 'ngSanitize', 'ngCookies', 'angular-loading-bar',
			'fnlf-login', 'resolve', 'ngTable' ]);

	var editorApp = angular.module('editorApp', [ 'ngRoute', 'ui.bootstrap',
			'ui.select', 'ngSanitize', 'ngCookies', 'angular-loading-bar',
			'fnlf-login', 'resolve', 'ngTable','reportingApp' ]);

	editorApp.config([ 'cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeBar = true;
		cfpLoadingBarProvider.includeSpinner = true;
	} ]);

})();

angular.module("editorApp").controller("editorController",[
				'$scope',
				'$http',
				'editorService',
				'$timeout',
				'$rootScope',
				'$window',
				'ngTableParams',
				'$filter',
				'$routeParams',
				'RestService',
				function($scope, $http, editorService, $timeout, $rootScope, $window, ngTableParams, $filter, $routeParams, RestService) {

					$scope.observation={};
					$scope.observation.components=[];

					RestService.getObservationComponentTemplates()
						.success(function(data){
							$scope.templates = data._items;
							$scope.observation.components = $scope.templates;
						});

				} ]);

				angular.module("editorApp").service("editorService",['$http',	'$q', '$rootScope', function($http, $q, $rootScope) {



								} ]);