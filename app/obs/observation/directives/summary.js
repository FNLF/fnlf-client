angular.module('reportingApp').directive('summary', function (ObservationService, RestService, $aside, $rootScope, $window) {
	var directive = {};

	directive.restrict = 'E';
	directive.template = function(tElement, tAttrs) { 
		
		return '<button type="button" class="btn btn-default pull-right col-xs-12" ng-click="openSummaryAside()"><i class="fa fa-eye fa-fw"></i>Se datamodell</button>';
	};

	directive.scope = {
		observation: '='

	};
	
	directive.controller = function($scope, $rootScope, $location, $aside) {

		RestService.getWorkflowState($scope.observation._id)
			.then(function (response) {
				$scope.workflowState = response;
			});

		$scope.openSummaryAside = function() {
			$location.path('/observation/modal-route', false);
		    $scope.summaryAside = $aside({
		        scope: $scope,
		        title: 'Datamodellen',
		        //content: 'My Content', //Static custom content
		        show: true,
		        contentTemplate: '/app/obs/observation/directives/summary.html',
		        template: '/shared/partials/aside.html',
		        placement: 'full-left',
		        container: 'body',
		        backdrop: 'static',
		        animation: 'am-slide-left'
		        });   
		};
		// Needs to manually close aside on back button
		$rootScope.$on('$routeChangeStart', function(event, next, current) {
		  if($scope.summaryAside) {
			if($scope.summaryAside.$scope.$isShown && $location.path().indexOf('/modal-route') == -1) {
			  $scope.summaryAside.hide();
			}
		  }
		});
		
		$scope.$on('aside.hide', function() {
		  if($location.path().indexOf('/modal-route') != -1) {
			  $window.history.back();
		  };
		});
		
	};

	directive.link = function ($scope, element, attrs) {

		

	};

	return directive;
});