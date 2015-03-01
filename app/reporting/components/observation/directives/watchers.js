/**
 * 
 * Workflow directive
 * 
 * Skal bruke workflow servicen for å hente og utføre operasjoner mot observasjonens workflow
 * 
 */


angular.module('reportingApp')
	   .directive('watchers', function (RestService, ObservationService, $sce, ResolveService) {
  
	var directive = {};

	directive.restrict = 'E';
	
	directive.scope = {
		observation: '=',
	};
	
	directive.transcluded = true;
	
	directive.template = function(tElement, tAttrs) { 
		
		return '<button tooltip-placement="top" tooltip-html-unsafe="{{watchers}}" type="button" class="btn btn-{{button_watching}}" ng-click="toggleWatching()"><i class="fa fa-{{icon_watching}} fa-fw"></i>{{button_title}}</button>';
	};
	
	
	directive.controller = function ($scope, $route, $http, $q, $rootScope) {

		var urlBase = '/api/v1';
		
		$scope.toggleWatching = function() {
			
			if($scope.is_watching) {
				
				watching($scope.observation._id, 'stop').then(function(r) {
					$scope.setNotWatching();
				});
			}
			else {
				watching($scope.observation._id, 'start').then(function(r) {
					$scope.setWatching();
				});
			}
			
			$rootScope.loadObservation();
			//$route.reload();
			
		
		};
		
		$scope.setWatching = function() {
			$scope.is_watching = true;
			$scope.button_watching = 'success';
			$scope.icon_watching = 'eye';
			$scope.button_title = 'Stop watching';
		};
		
		$scope.setNotWatching = function() {
			$scope.is_watching = false;
			$scope.button_watching = 'default';
			$scope.icon_watching = 'eye-slash';
			$scope.button_title = 'Start watching';
		};
		
		function watching(objectid, action) {
			
			var request = $http({
				method : "post",
				url : urlBase + '/observations/watchers/' + objectid + '/' + action,
			});
			return (request.then(handleSuccess, handleError));

		};
		
		$scope.isWatching = function(objectid) {
			
			var request = $http({
				method : "get",
				url : urlBase + '/observations/watchers/' + objectid + '/watching'
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
			console.log(response.data);
			return (response.data);
		};
		
	};

		
	directive.link = function($scope, element, attrs) {
	
		$scope.$watch('observation',function(newValue,oldValue) {
		
			if(newValue && newValue._id) {
				
				$scope.is_watching = false;
				
				$scope.watchers = '<strong>Watchers:</strong><br />';
				for(key in $scope.observation.watchers) {
					
					ResolveService.getUser($scope.observation.watchers[key]).then(function(user) {
						$scope.watchers +=''+user.firstname +' ' + user.lastname+'<br />';
					});
				}

				//if($scope.observation.watchers.indexOf($scope.username)) {
				
				$scope.isWatching($scope.observation._id).then(function(r) {

					if(r.watching == true) {
						$scope.setWatching();
					}
					else {
						$scope.setNotWatching();
					};
				});
				
		};
	});
		
	};
		
	
	return directive;
	
});



