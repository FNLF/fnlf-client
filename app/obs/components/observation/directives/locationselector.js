
angular.module('reportingApp').directive('locationsummary', function ($window) {

	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "components/observation/directives/locationsummary.html";


	directive.scope = {
		location: '='
	};

	directive.link = function ($scope, element, attrs) {

				$scope.dragMarker = function(event){
					$scope.location.geo.coordinates[0]=event.latLng.k;
					$scope.location.geo.coordinates[1]=event.latLng.D;
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
		$scope.icao.push({icao: "ENAL", name: "Ålesund/Vigra",coords:[62.560598,6.113761]});
		$scope.icao.push({icao: "ENAN", name: "Andøya",coords:[69.2925,16.144167]});
		$scope.icao.push({icao: "ENAT", name: "Alta",coords:[69.978751,23.352679]});
		$scope.icao.push({icao: "ENBL", name: "Førde/Bringeland",coords:[61.391427,5.758601]});
		$scope.icao.push({icao: "ENBN", name: "Brønnøysund/Brønnøy",coords:[65.461878,12.21601]});
		$scope.icao.push({icao: "ENBO", name: "Bodø",coords:[67.268311,14.362235]});
		$scope.icao.push({icao: "ENBR", name: "Bergen/Flesland",coords:[60.29183,5.222017]});
		$scope.icao.push({icao: "ENBS", name: "Båtsfjord",coords:[70.600278,29.6925]});
		$scope.icao.push({icao: "ENBV", name: "Berlevåg",coords:[70.870036,29.029759]});
		$scope.icao.push({icao: "ENCN", name: "Kristiansand/Kjevik",coords:[58.20383,8.083769]});
		$scope.icao.push({icao: "ENDU", name: "Bardufoss",coords:[69.055833,18.540278]});
		$scope.icao.push({icao: "ENEV", name: "Harstad/Narvik/Evenes",coords:[68.491109,16.680574]});
		$scope.icao.push({icao: "ENFG", name: "Fagernes/Leirin",coords:[61.009102,9.294345]});
		$scope.icao.push({icao: "ENFL", name: "Florø",coords:[61.583363,5.016986]});
		$scope.icao.push({icao: "ENGM", name: "Oslo/Gardermoen",coords:[60.19755,11.100415]});
		$scope.icao.push({icao: "ENHD", name: "Haugesund/Karmøy",coords:[59.344053,5.214892]});
		$scope.icao.push({icao: "ENHF", name: "Hammerfest",coords:[70.679722,23.668611]});
		$scope.icao.push({icao: "ENHK", name: "Hasvik",coords:[70.486667,22.139722]});
		$scope.icao.push({icao: "ENHV", name: "Honningsvåg/Valan",coords:[71.009466,25.985302]});
		$scope.icao.push({icao: "ENKB", name: "Kristiansund/Kvernberget",coords:[63.111944,7.826111]});
		$scope.icao.push({icao: "ENKJ", name: "Kjeller",coords:[59.970737,11.039221]});
		$scope.icao.push({icao: "ENKR", name: "Kirkenes/Høybuktmoen",coords:[69.722428,29.883596]});
		$scope.icao.push({icao: "ENLK", name: "Leknes",coords:[68.153938,13.612544]});
		$scope.icao.push({icao: "ENMH", name: "Mehamn",coords:[71.028729,27.826061]});
		$scope.icao.push({icao: "ENML", name: "Molde/Årø",coords:[62.74643,7.260576]});
		$scope.icao.push({icao: "ENMS", name: "Mosjøen / Kjærstad",coords:[65.783611,13.215278]});
		$scope.icao.push({icao: "ENNA", name: "Banak",coords:[70.066267,24.982102]});
		$scope.icao.push({icao: "ENNK", name: "Narvik/Framnes",coords:[68.436005,17.388137]});
		$scope.icao.push({icao: "ENNM", name: "Namsos",coords:[64.466667,11.6]});
		$scope.icao.push({icao: "ENNO", name: "Notodden",coords:[59.566102,9.218067]});
		$scope.icao.push({icao: "ENOL", name: "Ørland",coords:[63.7,9.616667]});
		$scope.icao.push({icao: "ENOV", name: "Ørsta-Volda/Hovden",coords:[62.179992,6.079171]});
		$scope.icao.push({icao: "ENRA", name: "Mo i Rana/Røssvoll",coords:[66.363889,14.301389]});
		$scope.icao.push({icao: "ENRM", name: "Rørvik/Ryum",coords:[64.83836,11.14462]});
		$scope.icao.push({icao: "ENRO", name: "Røros",coords:[62.576541,11.352506]});
		$scope.icao.push({icao: "ENRS", name: "Røst",coords:[67.527403,12.104782]});
		$scope.icao.push({icao: "ENRY", name: "Rygge",coords:[59.378374,10.784197]});
		$scope.icao.push({icao: "ENSB", name: "Svalbard/Longyear",coords:[78.246084,15.465563]});
		$scope.icao.push({icao: "ENSD", name: "Sandane/Anda",coords:[61.829902,6.107882]});
		$scope.icao.push({icao: "ENSG", name: "Sogndal/Haukåsen",coords:[61.156111,7.137778]});
		$scope.icao.push({icao: "ENSH", name: "Svolvær/Helle",coords:[68.243333,14.669167]});
		$scope.icao.push({icao: "ENSK", name: "Stokmarknes/Skagen",coords:[68.580593,15.022865]});
		$scope.icao.push({icao: "ENSN", name: "Skien/Geiteryggen",coords:[59.184653,9.567133]});
		$scope.icao.push({icao: "ENSO", name: "Stord/Sørstokken",coords:[59.79241,5.341159]});
		$scope.icao.push({icao: "ENSR", name: "Sørkjosen",coords:[69.786093,20.959858]});
		$scope.icao.push({icao: "ENSS", name: "Vardø/Svartnes",coords:[70.355278,31.045]});
		$scope.icao.push({icao: "ENST", name: "Sandnessjøen / Stokka",coords:[65.959444,12.471944]});
		$scope.icao.push({icao: "ENTC", name: "Tromsø",coords:[69.681935,18.916264]});
		$scope.icao.push({icao: "ENTO", name: "Torp",coords:[9.182446,10.256912]});
		$scope.icao.push({icao: "ENVA", name: "Trondheim/Værnes",coords:[63.45827,10.922599]});
		$scope.icao.push({icao: "ENVD", name: "Vadsø",coords:[70.065186,29.843524]});
		$scope.icao.push({icao: "ENZV", name: "Stavanger/Sola",coords:[58.880441,5.631402]});
		$scope.icao.push({icao: "ENOR", name: "Norway FIR",coords:[57.484,2.797]});
		/*
		$scope.icao.push({icao: "ENOB", name: "Bodø OFIR"});
		$scope.icao.push({icao: "ENSA", name: "Svea/Svalbard"});
		$scope.icao.push({icao: "ENVR", name: "Værøy Heliport"});
		$scope.icao.push({icao: "ENAS", name: "Ny Ålesund"});
		*/
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

		$scope.dragMarker = function(a){
			console.log('dragMarker');
			console.log(a);
		};

		$scope.placeMarker = function(a){
			console.log('click');
			console.log(a);
		};

		$scope.formatter = function(obj){

			if(angular.isUndefined(obj)){
				return '';
			}

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
