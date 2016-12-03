
angular.module('reportingApp')
	   .directive('actions', function ($rootScope) {
  
	var directive = {};

	directive.restrict = 'E';
	
	directive.scope = {
		observation: '=',
		acl: '='
	};

	directive.templateUrl = '/app/obs/observation/directives/actions.html';

	
	
	directive.controller = function ($scope, $rootScope, $location, $window) {
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


		
	};

		
	directive.link = function($scope, element, attrs) {
		
		if(typeof $scope.observation.actions == 'undefined') $scope.observation.actions = {local: [], central: []};
		if(typeof $scope.observation.actions.local == 'undefined') $scope.observation.actions.local = [];
		if(typeof $scope.observation.actions.central == 'undefined') $scope.observation.actions.central = [];
		
		
		
	};
		
	
	return directive;
	
});



