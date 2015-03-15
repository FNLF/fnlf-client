
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

	directive.require = 'location';
	directive.scope = {
		location: '=',
		
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


angular.module('reportingApp').directive('locationselector', function (LocationService, ObservationService, $rootScope, $timeout) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "components/observation/directives/locationselector.html";

	directive.scope = {
		observation: '=',
		clublocations: '=',
		locationAside: '='

	};
	

	
	directive.controller = function($scope) {
		
		
		/** Could also use a close by using coordinates for airports! **/
		$scope.icao = [];
		$scope.icao.push({icao: "ENAL", name: "Ålesund/Vigra"});
		$scope.icao.push({icao: "ENAN", name: "Andøya"});
		$scope.icao.push({icao: "ENAT", name: "Alta"});
		$scope.icao.push({icao: "ENBL", name: "Førde/Bringeland"});
		$scope.icao.push({icao: "ENBN", name: "Brønnøysund/Brønnøy"});
		$scope.icao.push({icao: "ENBO", name: "Bodø"});
		$scope.icao.push({icao: "ENBR", name: "Bergen/Flesland"});
		$scope.icao.push({icao: "ENBS", name: "Båtsfjord"});
		$scope.icao.push({icao: "ENBV", name: "Berlevåg"});
		$scope.icao.push({icao: "ENCN", name: "Kristiansand/Kjevik"});
		$scope.icao.push({icao: "ENDU", name: "Bardufoss"});
		$scope.icao.push({icao: "ENEV", name: "Harstad/Narvik/Evenes"});
		$scope.icao.push({icao: "ENFG", name: "Fagernes/Leirin"});
		$scope.icao.push({icao: "ENFL", name: "Florø"});
		$scope.icao.push({icao: "ENGM", name: "Oslo/Gardermoen"});
		$scope.icao.push({icao: "ENHD", name: "Haugesund/Karmøy"});
		$scope.icao.push({icao: "ENHF", name: "Hammerfest"});
		$scope.icao.push({icao: "ENHK", name: "Hasvik"});
		$scope.icao.push({icao: "ENHV", name: "Honningsvåg/Valan"});
		$scope.icao.push({icao: "ENKB", name: "Kristiansund/Kvernberget"});
		$scope.icao.push({icao: "ENKJ", name: "Kjeller"});
		$scope.icao.push({icao: "ENKR", name: "Kirkenes/Høybuktmoen"});
		$scope.icao.push({icao: "ENLK", name: "Leknes"});
		$scope.icao.push({icao: "ENMH", name: "Mehamn"});
		$scope.icao.push({icao: "ENML", name: "Molde/Årø"});
		$scope.icao.push({icao: "ENMS", name: "Mosjøen / Kjærstad"});
		$scope.icao.push({icao: "ENNA", name: "Banak"});
		$scope.icao.push({icao: "ENNK", name: "Narvik/Framnes"});
		$scope.icao.push({icao: "ENNM", name: "Namsos"});
		$scope.icao.push({icao: "ENNO", name: "Notodden"});
		$scope.icao.push({icao: "ENOL", name: "Ørland"});
		$scope.icao.push({icao: "ENOV", name: "Ørsta-Volda/Hovden"});
		$scope.icao.push({icao: "ENRA", name: "Mo i Rana/Røssvoll"});
		$scope.icao.push({icao: "ENRM", name: "Rørvik/Ryum"});
		$scope.icao.push({icao: "ENRO", name: "Røros"});
		$scope.icao.push({icao: "ENRS", name: "Røst"});
		$scope.icao.push({icao: "ENRY", name: "Rygge"});
		$scope.icao.push({icao: "ENSB", name: "Svalbard/Longyear"});
		$scope.icao.push({icao: "ENSD", name: "Sandane/Anda"});
		$scope.icao.push({icao: "ENSG", name: "Sogndal/Haukåsen"});
		$scope.icao.push({icao: "ENSH", name: "Svolvær/Helle"});
		$scope.icao.push({icao: "ENSK", name: "Stokmarknes/Skagen"});
		$scope.icao.push({icao: "ENSN", name: "Skien/Geiteryggen"});
		$scope.icao.push({icao: "ENSO", name: "Stord/Sørstokken"});
		$scope.icao.push({icao: "ENSR", name: "Sørkjosen"});
		$scope.icao.push({icao: "ENSS", name: "Vardø/Svartnes"});
		$scope.icao.push({icao: "ENST", name: "Sandnessjøen / Stokka"});
		$scope.icao.push({icao: "ENTC", name: "Tromsø"});
		$scope.icao.push({icao: "ENTO", name: "Torp"});
		$scope.icao.push({icao: "ENVA", name: "Trondheim/Værnes"});
		$scope.icao.push({icao: "ENVD", name: "Vadsø"});
		$scope.icao.push({icao: "ENZV", name: "Stavanger/Sola"});
		$scope.icao.push({icao: "ENOR", name: "Norway FIR"});
		$scope.icao.push({icao: "ENOB", name: "Bodø OFIR"});
		$scope.icao.push({icao: "ENSA", name: "Svea/Svalbard"});
		$scope.icao.push({icao: "ENVR", name: "Værøy Heliport"});
		$scope.icao.push({icao: "ENAS", name: "Ny Ålesund"});
		
		$scope.locationSelected = function($item, $model, $label) {
			
			console.log($item);
			console.log($model);
			console.log($label);
		};
//		ng-model="location.location"
		
		function getClubLocations() {
			
			LocationService.getClubLocations($scope.observation.club).then(function(response) {
				
				return response;
				
			});
		};
		
		$scope.saveLocation = function() {
			
			var obj = {};
			obj = $scope.location.location;
			obj.nickname = $scope.location.nickname;
			obj.icao = $scope.location.icao.icao;
			
			//Get locations from club
			
			LocationService.getClubLocations($scope.observation.club).then(function(response) {
				
				var locations = response.locations;
				
				if(!locations) location = [];
				
				if($scope.location.isdefault) {
					locations.unshift(obj);
				}
				else locations.push(obj);
				
				LocationService.saveClubLocations($scope.observation.club, locations, response._etag, response._id).success(function(response) {
					console.log(response);
					
					$scope.clublocations = response.locations;
					$scope.observation.location = obj;
					
					$rootScope.saveObservation();
					
					$timeout(function(){
						$rootScope.loadObservation();
					},1000);
					
					$rootScope.hideLocationAside();
					
					
					
					});
			});
			
		};
	};


	directive.link = function ($scope, element, attrs) {

		$scope.locations = [];

		$scope.formatter = function(obj){

			if(Object.keys(obj).length==0){
				return '';
			}
			return obj.name+' '+obj.geo_type+' '+obj.municipality;
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
