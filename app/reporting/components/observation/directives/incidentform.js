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


	var incidentform = function (RestService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "components/observation/directives/incidentform.html";

		directive.scope = {
			observation: '='
		};

		directive.link = function ($scope, element, attrs) {
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