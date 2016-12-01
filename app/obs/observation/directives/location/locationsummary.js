
angular.module('reportingApp').directive('locationsummary', function ($window,$rootScope,LocationService) {

	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "observation/directives/location/locationsummary.html";


	directive.scope = {
		clublocations: '=',
		observation: '=',
		acl: '='
	};

	directive.link = function ($scope, element, attrs) {

		$scope.editLocationsButtonClicked = function(){
			$rootScope.setFullscreen('location')
		};


		$scope.dragMarker = function(event){
			$scope.observation.location.geo.coordinates[0]=event.latLng.lat();
			$scope.observation.location.geo.coordinates[1]=event.latLng.lng();
			$scope.markerDragged=true;
		};

		$scope.$watch('location',function() {
			$scope.markerDragged=false;
		});


	};

	return directive;
});
