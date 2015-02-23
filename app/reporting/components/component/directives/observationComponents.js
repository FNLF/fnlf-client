(function () {

	angular.module('reportingApp').directive('observationComponentSummary', function (Definitions) {

		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "components/component/directives/observationComponentSummary.html";

		directive.scope = {
			component: '='
		};

		directive.link = function ($scope, element, attrs) {
			$scope.getAttributesAsTags = function(component){
				return Definitions.componentTagsFromAttributes(component.attributes);
			};

		};

		return directive;
	});

	angular.module('reportingApp').directive('observationComponentsSummary', function () {

		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "components/component/directives/observationComponentsSummary.html";
		
		directive.scope = {
			observation: '='
		};

		directive.link = function ($scope, element, attrs) {

		};

		return directive;
	});


	var observationComponents = function (RestService, $aside,Definitions, $rootScope, $window) {
		var directive = {};

		directive.restrict = 'E';
//		directive.templateUrl = "components/observation/directives/observationComponents.html";
		
		directive.template = function(tElement, tAttrs) { 
			
			return '<button type="button" class="btn btn-default pull-right" ng-click="openIncidentAside()"><i class="fa fa-plus fa-fw"></i>Endre observasjonsforløp</button>';
		};

		directive.scope = {
			observation: '='
		};

		directive.controller = function ($scope, $rootScope, $location, $aside) {
			
			$scope.openIncidentAside = function() {
				$location.path('/observation/modal-route', false);
			    $scope.incidentAside = $aside({
			        scope: $scope,
			        title: 'Observasjonsforløp',
			        //content: 'My Content', //Static custom content
			        show: true,
			        contentTemplate: '/app/reporting/components/component/directives/observationComponents.html',
			        template: '/shared/partials/aside.html',
			        placement: 'full-left',
			        container: 'body',
			        backdrop: 'static',
			        animation: 'am-slide-left'
			        });   
			};
			// Needs to manually close aside on back button
			$rootScope.$on('$routeChangeStart', function(event, next, current) {
				if($scope.incidentAside) {
				  if($scope.incidentAside.$scope.$isShown && $location.path().indexOf('/modal-route') == -1) {
					  $scope.incidentAside.hide(); 
				  }
				}
			});
			
			$scope.$on('aside.hide', function() {
			  if($location.path().indexOf('/modal-route') != -1) {
				  $window.history.back();
			  };
			});
			
		};
		directive.link = function ($scope, element, attr) {
			

			if(angular.isUndefined($scope.observation.components)){
				$scope.observation.components = [];
			}

			$scope.persons = $scope.observation.involved.map(function(p){
				return {id:p.id, fullname:p.fullname};
			})

			$scope.templates=[];
			RestService.getObservationComponentTemplates()
				.success(function(data){
					$scope.templates = data._items;
				});

			$scope.newComponent = function(selectedTemplate){

				$scope.selectedTemplate = selectedTemplate;
				$scope.selectedTemplate.involved = [].concat($scope.persons);
				$scope.selectedTemplate.tags = Definitions.componentTagsFromAttributes(selectedTemplate.attributes);
				$scope.observation.components.push(selectedTemplate);


				return false;
			};

			$scope.deleteComponent = function(component){
				var index = $scope.observation.components.indexOf(component);
				$scope.observation.components.splice(index,1);
			};

			$scope.newCause = function(){
				var template = {};
				template.what="Årsak";
				template.involved = [].concat($scope.persons);
				template.flags={};
				template.flags.root_cause=true;
				template.where = {};
				template.where.altitude = 0;
				$scope.closeOthers(template);

				$scope.observation.components.unshift(template);
			};

			$scope.newBarrier = function(){
				var template = {};
				template.what="Sikkerhetsbarriære";
				template.involved = [].concat($scope.persons);
				template.flags={};
				template.flags.barrier=true;
				template.where = {};
				template.where.altitude = 0;
				$scope.closeOthers(template);
				$scope.observation.components.unshift(template);

			};

			$scope.newConsequence = function(){
				var template = {};
				template.what="Konsekvens";
				template.involved = [].concat($scope.persons);
				template.flags={};
				template.flags.final_consequence=true;
				template.where = {};
				template.where.altitude = 0;
				$scope.closeOthers(template);
				$scope.observation.components.push(template);
			};

			$scope.getStaticTags = function(){
				return Definitions.getComponentTags();
			};

			$scope.staticTags = Definitions.getComponentTags();

			$scope.initComponent = function(component){
			//	component.attributes = Definitions.componentAttributesFromTags(component.tags);
			};

			$scope.closeOthers = function(component){

				$scope.observation.components.forEach(function(c){
					c.open=false;
				});
				component.open=true;
			};

		};

		return directive;
	};

	angular.module('reportingApp').directive('observationComponents', observationComponents);

})();