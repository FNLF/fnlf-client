(function() {

	var reportingApp = angular.module('reportingApp', [ 'ngRoute', 'ui.bootstrap',
			'ui.select', 'ngSanitize', 'ngCookies', 'angular-loading-bar',
			'fnlf-login', 'resolve', 'ngTable' ]);

	var editorApp = angular.module('editorApp', [ 'ngRoute', 'ui.bootstrap',
			'ui.select', 'ngSanitize', 'ngCookies', 'angular-loading-bar',
			'fnlf-login', 'resolve', 'ngTable','reportingApp','angled-navbar.directives' ]);

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

					// Menus
					$rootScope.nav = {toolbar: [], menus: []}; //reset
					$rootScope.nav.brand = 'FNLF Editor';
					
					
					$scope.templates=[];
					RestService.getObservationComponentTemplates()
						.then(function(data){
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
					RestService.getAllTags(1)
						.then(function(data){
							$scope.allTags = data._items;
						});





					$scope.tagUp = function(tag){
						for(var i=0; i < 10; i++) {
							RestService.addTag(tag.tag, tag.group);
						}
						tag.freq+=10;
					};

					$scope.tagDown = function(tag){
						RestService.removeTag(tag.tag,tag.group);
						tag.freq-=10;
					};
					$scope.page=1;
					$scope.sort = "group,-freq";

					$scope.sortByTag = function(){
						$scope.sort = "tag,-freq";
						$scope.getTags($scope.page,$scope.sort);
					};

					$scope.sortByFreq = function(){
						$scope.sort = "-freq,group";
						$scope.getTags($scope.page,$scope.sort);
					};

					$scope.sortByGroup = function(){
						$scope.sort = "group,-freq";
						$scope.getTags($scope.page,$scope.sort);
					};


					$scope.getTags = function(page){
						$scope.page=page;
						RestService.getAllTags(page,$scope.sort)
							.then(function(data){
								$scope.allTags = data._items;
							});
					};

				} ]);




				angular.module("editorApp").service("editorService",['$http',	'$q', '$rootScope', function($http, $q, $rootScope) {



								} ]);