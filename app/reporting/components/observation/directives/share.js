/**
 * 
 * Workflow directive
 * 
 * Skal bruke workflow servicen for å hente og utføre operasjoner mot observasjonens workflow
 * 
 */


angular.module('reportingApp')
	   .directive('share', function (RestService, ObservationService, $aside, $rootScope, $window) {
  
	var directive = {};

	directive.restrict = 'E';
	
	directive.scope = {
		observation: '=',
		observationChanges: '='
	};
	
	directive.template = function(tElement, tAttrs) { 
		
		return '<button class="btn btn-default" ng-disabled="observationChanges" ng-click="openShareAside()"><i class="fa fa-envelope-o fa-fw"></i>Share</button>';
	};
	
	
	directive.controller = function ($scope, $rootScope, $location, $aside) {

		$scope.openShareAside = function() {
			
			$location.path('/observation/modal-route', false);
			
			  $scope.shareAside = $aside({
					scope: $scope,
					title: 'Del observasjon #' + $scope.observation.id, 
					show: true,
					contentTemplate: '/app/reporting/components/observation/directives/share.html',
					template: '/shared/partials/aside.html',
					placement: 'full-left',
					container: 'body',
					backdrop: 'static',
					animation: 'am-slide-left',
					});

		};
			
		// Needs to manually close aside on back button
		$rootScope.$on('$routeChangeStart', function(event, next, current) {
		  if($scope.shareAside) {
			  if($scope.shareAside.$scope.$isShown && $location.path().indexOf('/modal-route') == -1) {
				  $scope.shareAside.hide();
			  }
		  }
		});
		
		$scope.$on('aside.hide', function() {
		  if($location.path().indexOf('/modal-route') != -1) {
			  $window.history.back();
		  };
		});
		
	};

		
	directive.link = function($scope, element, attrs) {
	
		$scope.personsFromDb = [];

		$scope.getPersonsByName = function (name) {
				RestService.getUserByName(name)
				.success(function (response) {
					$scope.personsFromDb = response._items;
				});
		};

		$scope.tagTransform = function(itemText){

			return {fullname:itemText,id:0};
		}
		
	};
		
	
	return directive;
	
});



