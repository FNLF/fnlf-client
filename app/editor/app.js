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


					$scope.templates=[];
					RestService.getObservationComponentTemplates()
						.success(function(data){
							$scope.templates = data._items;


							var i = 0;

							$scope.templates.forEach(function(t){
								if(!t.sort){
									t.sort = i;

								}
								i++;
							});

						});
					$scope.allTags = [];
					RestService.getAllTags()
						.success(function(data){
							$scope.allTags = data._items;
						});


					$scope.newTemplate = function(){
						var component = {};
						component.what='ny';

						RestService.createObservationComponentTemplate(component)
							.success(function(data){
								console.log('Created new template');
								console.log(data);
								$scope.templates.push(data);
								data.sort = $scope.templates.length;
							});
					};

					var saveFn = function(component){
						RestService.updateObservationComponentTemplate(component)
								.success(function(data){
									console.log(data);
									//angular.copy(data,component);
								});
					};


					$scope.incrementSort = function(component){
						component.sort++;
						saveFn(component);
					};

					$scope.decrementSort = function(component){
						component.sort--;
						saveFn(component);

					};

					$scope.hideTemplate = function(component){
						component.active=false;
						saveFn(component);
					};

					$scope.showTemplate = function(component){
						component.active=true;
						saveFn(component);
					};

					$scope.saveTemplate = function(component){
						saveFn(component);
					};

				} ]);




				angular.module("editorApp").service("editorService",['$http',	'$q', '$rootScope', function($http, $q, $rootScope) {



								} ]);