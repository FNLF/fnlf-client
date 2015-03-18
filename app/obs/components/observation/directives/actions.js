
angular.module('reportingApp')
	   .directive('actions', function ($rootScope) {
  
	var directive = {};

	directive.restrict = 'E';
	
	directive.scope = {
		observation: '=',
	};
	
//	directive.templateUrl = 'components/observation/directives/actions.html';
	directive.template = function(tElement, tAttrs) { 
		
		return '<button type="button" class="btn btn-default btn-block" ng-click="openActionsAside()"><i class="fa fa-plus fa-fw"></i> Legg til tiltak</button>';
	};
	
	
	
	directive.controller = function ($scope, $rootScope, $location, $aside, $window) {
		var urlBase = '/api/v1';
		
		
		$scope.addActionLocal = function(action) {
			
			$scope.observation.actions.local.push(action);
			$scope.actionLocal = '';
		};
		$scope.addActionCentral = function(action) {
			
			$scope.observation.actions.central.push(action);
			$scope.actionCentral = '';
		};
		
		$scope.removeActionLocal = function(index) {
			
			$scope.observation.actions.local.splice(index, 1);
		};
		$scope.removeActionCentral = function(index) {
			
			$scope.observation.actions.central.splice(index, 1);
		};
		
		$scope.openActionsAside = function() {
			
			$location.path('/observation/modal-route', false);
			
			  $scope.actionsAside = $aside({
					scope: $scope,
					title: 'Tiltak for observasjon #' + $scope.observation.id, 
					show: true,
					contentTemplate: '/app/obs/components/observation/directives/actions.html',
					template: '/shared/partials/aside.html',
					placement: 'full-left',
					container: 'body',
					backdrop: 'static',
					animation: 'am-slide-left',
					});

		};
			
		// Needs to manually close aside on back button
		$rootScope.$on('$routeChangeStart', function(event, next, current) {
		  if($scope.actionsAside) {
			  if($scope.actionsAside.$scope.$isShown && $location.path().indexOf('/modal-route') == -1) {
				  $scope.actionsAside.hide();
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
		
		if(typeof $scope.observation.actions == 'undefined') $scope.observation.actions = {local: [], central: []};
		if(typeof $scope.observation.actions.local == 'undefined') $scope.observation.actions.local = [];
		if(typeof $scope.observation.actions.central == 'undefined') $scope.observation.actions.central = [];
		
		
		
	};
		
	
	return directive;
	
});



