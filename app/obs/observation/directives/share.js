/**
 * 
 * Workflow directive
 * 
 * Skal bruke workflow servicen for å hente og utføre operasjoner mot observasjonens workflow
 * 
 */


angular.module('reportingApp')
	   .directive('share', function (RestService, ObservationService, $aside, $rootScope, $window, $http, $q) {
  
	var directive = {};

	directive.restrict = 'E';
	
	directive.scope = {
		observation: '=',
		observationChanges: '='
	};
	
	directive.template = function(tElement, tAttrs) { 
		
		return '<button class="btn btn-sm btn-primary" ng-disabled="observationChanges" ng-click="openShareAside()"><i class="fa fa-envelope-o fa-fw"></i> Del</button>';
	};
	
	
	directive.controller = function ($scope, $rootScope, $location, $aside) {
		var urlBase = '/api/v1';
		$scope.openShareAside = function() {
			
			$location.path('/observation/modal-route', false);
			
			  $scope.shareAside = $aside({
					scope: $scope,
					title: 'Del observasjon #' + $scope.observation.id, 
					show: true,
					contentTemplate: '/app/obs/components/observation/directives/share.html',
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
		
		$scope._share = function(recepients, comment, title) {

			var request = $http({
				method : "post",
				data: {comment: comment, recepients: recepients, title: title},
				url : urlBase + '/observations/share/'+$scope.observation.id
			});
			return (request.then(handleSuccess, handleError));

		};
		
		function handleError(response) {
			if (!angular.isObject(response.data) || !response.data.message) {
				return ($q.reject("An unknown error occurred."));
			}
			return ($q.reject(response.data.message));
		}
		function handleSuccess(response) {
			return (response.data);
		};
		
	};

		
	directive.link = function($scope, element, attrs) {
	
		$scope.personsFromDb = [];
		
		$scope.share = {recepients: [], comment: '', persons: [], success: '', error: ''};
		
		$scope.getPersonsByName = function (name) {
				RestService.getUserByName(name)
				.then(function (response) {
					$scope.personsFromDb = response._items;
				});
		};

		$scope.tagTransform = function(itemText){

			return {fullname:itemText,id:0};
		};
		
		$scope.onSelect = function(item, model) {
			
			$scope.share.recepients.push(item.id);
			
		};
		
		$scope.onRemove = function(item, model) {
			
			$scope.share.recepients.splice($scope.share.recepients.indexOf(item.id), 1);
		};
		
		
		$scope.shareObservation = function() {
			if($scope.share.recepients.length > 0) {
				$scope._share($scope.share.recepients, $scope.share.comment, $scope.observation.tags.join('/')).then(function(r) {
					$scope.share.comment='';
					$scope.share.persons = [];
					$scope.share.recepients = [];
					$scope.share.success = 'Observasjonen ble delt';
					
				});
			}
		};
	};
		
	
	return directive;
	
});



