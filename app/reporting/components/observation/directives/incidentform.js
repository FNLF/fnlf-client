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


	var incidentform = function (RestService, $aside) {
		var directive = {};

		directive.restrict = 'E';
//		directive.templateUrl = "components/observation/directives/incidentform.html";
		
		directive.template = function(tElement, tAttrs) { 
			
			return '<button type="button" class="btn btn-default pull-right" ng-click="openIncidentAside()"><i class="fa fa-plus fa-fw"></i>Endre observasjonsforløp</button>';
		};

		directive.scope = {
			observation: '='
		};

		directive.link = function ($scope, element, attrs) {
			
			$scope.isCollapsed = false;
			
			$scope.openIncidentAside = function() {
			    $scope.myAside = $aside({
			        scope: $scope,
			        title: 'Observasjonsforløp',
			        //content: 'My Content', //Static custom content
			        show: true,
			        contentTemplate: '/app/reporting/components/observation/directives/incidentform.html',
			        template: '/shared/partials/aside.html',
			        placement: 'full-left',
			        container: 'body',
			        animation: 'am-slide-left',
			        });   
			};
			
			
			if(angular.isUndefined($scope.observation.components)){
				$scope.observation.components = [];
			}

			$scope.templates=[];
			RestService.getObservationComponentTemplates()
				.success(function(data){
					$scope.templates = data._items;
				});

			$scope.newComponent = function(selectedTemplate){
					$scope.selectedTemplate = selectedTemplate;
					$scope.observation.components.push(selectedTemplate);
				return false;
			};

		};

		return directive;
	};

	angular.module('reportingApp').directive('incidentform', incidentform);

})();

