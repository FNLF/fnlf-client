angular.module('reportingApp').directive('summary', function (ObservationService, RestService, $aside) {
	var directive = {};

	directive.restrict = 'E';
	directive.template = function(tElement, tAttrs) { 
		
		return '<button type="button" class="btn btn-default pull-right" ng-click="openSummaryAside()"><i class="fa fa-eye fa-fw"></i>Se datamodell</button>';
	};

	directive.scope = {
		observation: '='

	};

	directive.link = function ($scope, element, attrs) {


		$scope.openSummaryAside = function() {
		    $scope.myAside = $aside({
		        scope: $scope,
		        title: 'Datamodellen',
		        //content: 'My Content', //Static custom content
		        show: true,
		        contentTemplate: '/app/reporting/components/observation/directives/summary.html',
		        template: '/shared/partials/aside.html',
		        placement: 'full-left',
		        container: 'body',
		        animation: 'am-slide-left'
		        });   
		};
	};

	return directive;
});