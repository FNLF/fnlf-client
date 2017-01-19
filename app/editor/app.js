(function() {

	var editorApp = angular.module('editorApp', [ 'ngRoute', 'ui.bootstrap',
			'ui.select', 'ngSanitize', 'ngCookies', 'angular-loading-bar',
			'fnlf-login', 'resolve','fnlf-services', 'ngTable','angled-navbar.directives' ]);

	editorApp.config([ 'cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeBar = true;
		cfpLoadingBarProvider.includeSpinner = true;
	} ]);

})();

angular.module("editorApp").controller("editorController",[
				'$scope',
				'$http',
				'editorService',
				'Appswitcher',
				'$timeout',
				'$rootScope',
				'$window',
				'ngTableParams',
				'$filter',
				'$routeParams',
				'RestService',
				function($scope, $http, editorService, Appswitcher, $timeout, $rootScope, $window, ngTableParams, $filter, $routeParams, RestService, Definitions) {

					// Menus
					Appswitcher.getApps();
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

					$scope.filter='observation';
					$scope.filterText = "Observasjonstittel";
					$scope.getTags($scope.page);



					$scope.groups = [];
					var distinctGroups = {};
					$scope.setFilter = function(filter){
						$scope.filter = filter;
						$scope.page = 1;
						$scope.getTags($scope.page);
						$scope.filterText = $scope.groupTexts[filter];
					}

					var textMapping = function(){
						var mapping = {};
						mapping['observation'] = 'Observasjonstittel';
						mapping['component'] = 'Tagger (forløp)';
						mapping['component.what.cause'] = 'Årsak (forløp)';
						mapping['component.what.consequence'] = 'Konsekvens (forløp)';
						mapping['component.what.incident'] = 'Hendelse (forløp)';
						mapping['where-at'] = 'Sted/situasjon';
						mapping['jumptypes'] = 'Hopptype-tagg';
						mapping['aircraftTypes'] = 'Flytype';
						mapping['maincanopies'] = 'Hovedskjermtype';
						mapping['reserveCanopies'] = 'Reserveskjermtype';
						mapping['harnessTypes'] = 'Seletøytype';
						mapping['aadType'] = 'Nødåpnertype';
						mapping['otherEquipment'] = 'Ymse utstyr';
						return mapping;
					};

					$scope.groupTexts = textMapping();

					var tagsMapping = function(){

						var mapping = {}; //mapping from db-model param name to list of tag group names
						mapping['tags'] = ['observation'];
						mapping['components.tags'] = ['component'];
						mapping['components.what'] = ['component.what.cause', 'component.what.consequence', 'component.what.incident'];
						mapping['components.where.at'] = ['where-at'];
						mapping['involved.jumptypeTags'] = ['jumptypes'];
						mapping['involved.aircraft'] = ['aircraftTypes'];
						mapping['involved.gear.mainCanopyType'] = ['maincanopies'];
						mapping['involved.gear.reserveCanopyType'] = ['reserveCanopies'];
						mapping['involved.gear.harnessType'] = ['harnessTypes'];
						mapping['involved.gear.aadType'] = ['aadType'];
						mapping['involved.gear.other'] = ['otherEquipment'];

						return mapping;
					};


					$scope.getTagGroups = function(){
						console.log('getTagGroups');

						var mapping = tagsMapping();
							angular.forEach(mapping,function(v,k){
								angular.forEach(v,function(t){
									$scope.groups.push(t);
								});

						});

					};



					$scope.getTagGroups();
				} ]);




				angular.module("editorApp").service("editorService",['$http',	'$q', '$rootScope', function($http, $q, $rootScope) {



								} ]);