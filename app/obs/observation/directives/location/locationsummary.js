
angular.module('reportingApp').directive('locationsummary', function ($window) {

	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "observation/directives/location/locationsummary.html";


	directive.scope = {
		location: '=',
		acl: '='
	};

	directive.link = function ($scope, element, attrs) {

		$scope.dragMarker = function(event){
			$scope.location.geo.coordinates[0]=event.latLng.lat();
			$scope.location.geo.coordinates[1]=event.latLng.lng();
			$scope.markerDragged=true;
		};

		$scope.$watch('location',function() {
			$scope.markerDragged=false;
		});

//		$scope.$on('mapInitialized', function (event, map) {
//		    $window.setTimeout(function() {
//		        map.setCenter(new google.maps.LatLng($scope.observation.north, $scope.observation.east));
//		    }, 100);
//		});

	};

	return directive;
});
