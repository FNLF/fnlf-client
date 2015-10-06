angular.module('reportingApp').directive('location', function (LocationService) {
	var directive = {};

	directive.restrict = 'E';
	directive.template = function(tElement, tAttrs) { 
		
		return '<div class="form-group"> \
				<select ng-disabled="!acl.w" class="form-control" ng-model="observation.location" \
        		ng-options="opt as opt.nickname for opt in clublocations track by opt.nickname" ng-change="locationSelected()"> \
        		</select> \
				</div> \
				<div class="clearfix"></div> \
				<button type="button" class="btn btn-default btn-block" ng-click="openLocationAside()"><i class="fa fa-plus fa-fw"></i> Lagre nytt sted</button>';
	};

	directive.scope = {
		observation: '=',
		loadObservation: '@',
		saveObservation: '@',
		acl: '='
		
	};
	
	directive.controller = function($scope, $aside, $location, $rootScope, $http, $q, $window) {
		var urlBase = '/api/v1';
		
			$scope.openLocationAside = function() {
				
				$location.path('/observation/modal-route', false);
				
				  $scope.locationAside = $aside({
						scope: $scope,
						title: 'Legg til sted ',
						//content: 'My Content', 
						show: true,
						contentTemplate: '/app/obs/components/observation/directives/location.html',
						template: '/shared/partials/aside.html',
						placement: 'full-left',
						container: 'body',
						backdrop: 'static',
						animation: 'am-slide-left',
						});
	
			};
			
			$rootScope.hideLocationAside = function() {
				$scope.locationAside.hide();
			};
				
			// Needs to manually close aside on back button
			$rootScope.$on('$routeChangeStart', function(event, next, current) {
			  if($scope.locationAside) {
				  if($scope.locationAside.$scope.$isShown && $location.path().indexOf('/modal-route') == -1) {
					  $scope.locationAside.hide();
				  }
			  }
			});
			
			$scope.$on('aside.hide', function() {
				
			  if($location.path().indexOf('/modal-route') != -1) {
				  $window.history.back();
			  };
			});
			
			
			$scope.getClubLocations = function() {
				
				LocationService.getClubLocations($scope.observation.club).then(function(response) {
					
					//By definition, first item is default!
					//Ecmas 5 only!
					//if(Object.keys($scope.observation.location).length === 0) {
					if(typeof $scope.observation.location.nickname == 'undefined' && response.locations.length > 0) {
						$scope.observation.location = response.locations[0];
					};
					
					$scope.clublocations = response.locations;
					
				});
			};
			
			

			
		};


	directive.link = function ($scope, element, attrs) {
		
		$scope.showMarker = function(){
			$scope.observation.location = angular.copy($scope.observation.location);
		};

		$scope.getClubLocations();
		
	};
	
	return directive;
});

