(function () {

	angular.module('reportingApp').directive('incidentformSummary', function () {

		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "components/observation/directives/incidentformSummary.html";
		
		directive.scope = {
			observation: '='
		};

		directive.link = function ($scope, element, attrs) {

		};

		return directive;
	});


	var observationComponents = function (RestService, $aside,Definitions) {
		var directive = {};

		directive.restrict = 'E';
//		directive.templateUrl = "components/observation/directives/observationComponents.html";
		
		directive.template = function(tElement, tAttrs) { 
			
			return '<button type="button" class="btn btn-default pull-right" ng-click="openIncidentAside()"><i class="fa fa-plus fa-fw"></i>Endre observasjonsforløp</button>';
		};

		directive.scope = {
			observation: '='
		};

		directive.link = function ($scope, element, attrs) {
			
			
			$scope.openIncidentAside = function() {
			    $scope.myAside = $aside({
			        scope: $scope,
			        title: 'Observasjonsforløp',
			        //content: 'My Content', //Static custom content
			        show: true,
			        contentTemplate: '/app/reporting/components/component/directives/observationComponents.html',
			        template: '/shared/partials/aside.html',
			        placement: 'full-left',
			        container: 'body',
			        animation: 'am-slide-left'
			        });   
			};


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
				$scope.observation.components.push(template);
			};

			$scope.getStaticTags = function(){
				return Definitions.getComponentTags();
			};

			$scope.staticTags = Definitions.getComponentTags();

			$scope.initComponent = function(component){
			//	component.attributes = Definitions.componentAttributesFromTags(component.tags);
			};

		};

		return directive;
	};

	angular.module('reportingApp').directive('observationComponents', observationComponents);

})();