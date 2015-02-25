
angular.module('reportingApp').directive('locationSummary', function ($window) {

	var directive = {};

	directive.restrict = 'E';
	directive.template = function(tElement, tAttrs) {
		//'<a target="_blank" href="https://www.google.no/maps/@{{observation.location.north}},{{observation.location.east}},15z" <span>Kart</span>';
		return '<map center="{{observation.location.geo.coordinates}}"> \
				  <marker \
				      position="{{observation.location.geo.coordinates}}" \
				      title="{{observation.location.name}}" \
				      draggable="false" \
				      visible="true" \
				      ></marker> \
				</map>';
	};

	directive.scope = {
		observation: '='
	};

	directive.link = function ($scope, element, attrs) {
		
//		$scope.$on('mapInitialized', function (event, map) {
//		    $window.setTimeout(function() {
//		        map.setCenter(new google.maps.LatLng($scope.observation.north, $scope.observation.east));
//		    }, 100);
//		});

	};

	return directive;
});


angular.module('reportingApp').directive('locationselector', function (LocationService) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "components/observation/directives/locationselector.html";

	directive.scope = {
		observation: '='
	};

	directive.link = function ($scope, element, attrs) {

		$scope.locations = [];

		$scope.formatter = function(obj){

			if(Object.keys(obj).length==0){
				return '';
			}
			return obj.name;
		};

		$scope.getLocations = function(name){

			return LocationService.getPlaceNames(name).then(function(response){
				if(response.data._items){

					var array = [].concat(response.data._items);
					return array.map(function(place){
						
						var obj = {};
						
						obj.municipality = place.municipality;
						obj.county = place.county;
						obj.name = place.name;
						obj.geo = {coordinates: [place.geo.coordinates[0],place.geo.coordinates[1]], type: 'Point'};
						obj.geo_type = place.geo_type;
						
						return obj;
					});
			}else{
				return {};
			}
			});

		};
		
		$scope.getClubLocations = function() {
			
			
			return LocationService.getClubLocations($scope.observation.club).then(function(response) {
				
				
				
			});
		};

	};

	return directive;
});
