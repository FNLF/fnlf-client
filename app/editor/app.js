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

					$scope.resolvePersonsFn = function(){

					};
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

					$scope.page=1;
					$scope.sort = "group,-freq";
					$scope.allTags = [];




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

						var filterString = '{}';

						if(!angular.isUndefined($scope.filter)){
							filterString = '{"group":"'+$scope.filter+'"}';
						}

						RestService.getAllTags(page,$scope.sort,filterString)
							.then(function(data){
								$scope.allTags = data._items;
							});

					};

					$scope.getTags($scope.page);



					$scope.groups = [];
					var distinctGroups = {};
					$scope.setFilter = function(filter){
						$scope.filter = filter;
						$scope.page = 1;
						$scope.getTags($scope.page);

					}

					$scope.getTagGroups = function(){

						for(var i = 1; i < 3; i++) {
							RestService.getTagGroups(i)
								.then(function (data) {
									$scope.groups = [];

									var meta = data._meta;


									data._items.forEach(function (t) {
										distinctGroups[t.group] = t;
									});

									Object.keys(distinctGroups).forEach(function (k) {
										$scope.groups.push(distinctGroups[k].group);
									});

								});
						}

					};

					$scope.getTagGroups();
				} ]);




				angular.module("editorApp").service("editorService",['$http',	'$q', '$rootScope', function($http, $q, $rootScope) {



								} ]);