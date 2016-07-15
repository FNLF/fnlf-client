angular.module('reportingApp').directive('location', function (LocationService) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl ='/app/obs/observation/directives/location/location.html';


	directive.scope = {
		observation: '=',
		loadObservation: '@',
		saveObservation: '@',
		acl: '='
		
	};
	
	directive.controller = function($scope, $aside, $location, $rootScope, $http, $q, $window) {
		var urlBase = '/api/v1';
		

			
			
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

