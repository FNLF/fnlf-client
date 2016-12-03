
angular.module('reportingApp').directive('summaryButton', function (ObservationService, RestService, $rootScope, $window) {

var directive = {};

	directive.restrict = 'E';
	directive.template = '<button type="button" class="btn btn-default pull-right col-xs-12" ng-click="openSummary()"><i class="fa fa-eye fa-fw"></i>Se datamodell</button>';


	directive.scope = {
		observation: '='

	};

	directive.link = function ($scope, element, attrs) {

		$scope.openSummary = function(){
			$rootScope.setFullscreen('summary');
		};

	};

	return directive;
});

angular.module('reportingApp').directive('observationsummary', function (ObservationService, RestService, $rootScope, $window) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = '/app/obs/observation/directives/summary.html';


	directive.scope = {
		observation: '='

	};
	
	directive.controller = function($scope, $rootScope, $location) {

		RestService.getWorkflowState($scope.observation._id)
			.then(function (response) {
				$scope.workflowState = response;
			});

	};

	directive.link = function ($scope, element, attrs) {

		

	};

	return directive;
});