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

								if(!t.attributes){
									t.attributes={};
								}

								if(!t.flags){
									t.flags={};
								}else{
									delete t.flags.violation;
									delete t.flags.wilfull;
								}
								if(!t.tags){
									t.tags=[];
								}
								if(!t.involved){
							//		t.involved=[];
								}

								if(!t.sort){
									t.sort = i;
								}

								if(angular.isUndefined(t.active)){
									t.active=true;
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
								data.flags={};
								data.attributes={};
								data.where={};
								data.tags=[];
								data.active=true;
								$scope.templates.push(data);


								data.sort = $scope.templates.length;
							});
					};

					var saveFn = function(component){

						var dto = {};
						angular.copy(component,dto);


						var _id = component._id;
						var _etag = component._etag;


						delete dto.editTitle;
						delete dto.open;

						delete dto._updated;
						delete dto._latest_version;
						delete dto._version;
						delete dto.workflow;
						delete dto._links;
						delete dto._created;
						delete dto._status;
						delete dto._etag;
						delete dto._id;


						RestService.updateObservationComponentTemplate(dto,_id,_etag)
								.success(function(data){
									console.log(data);
									angular.copy(data,component);
								});
					};


					$scope.incrementSort = function(component){
						component.sort++;
						//saveFn(component);
					};

					$scope.decrementSort = function(component){
						component.sort--;
						//saveFn(component);

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