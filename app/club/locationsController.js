angular.module("clubApp").controller("locationsController",
							['$scope', '$http', 'clubService', '$timeout','$rootScope', '$window','$location',
							function($scope, $http, clubService, $timeout, $rootScope, $window, $location) {

	// Menus
	$rootScope.nav = {toolbar: [], menus: []}; //reset
	$rootScope.nav.brand = 'FNLF Klubb';

	$scope.zoom=7;
	$scope.coords=[];

	if(angular.isUndefined($location.search().club)){
		$rootScope.$watch('default_club',function(){
			$scope.selected_club = $rootScope.default_club;
		});
	}else{
		$scope.selected_club = $location.search().club;
	}

	$scope.getClubLocations = function(){

		clubService.getClubLocations($scope.selected_club).then(function(response){
    		if(response.locations) {

				var filteredLocations = response.locations
					.filter(function(l){
						return typeof l =='object' && typeof l.geo !='undefined' && typeof l.geo.coordinates != 'undefined';
					});
					console.log(filteredLocations);
				if(filteredLocations.length > 0){
					$scope.loc = filteredLocations[0];
                	$scope.coords=[$scope.loc.geo.coordinates[0],$scope.loc.geo.coordinates[1]];
                    $scope.clubLocations = filteredLocations;
				}

			}

    	});

	};

	var move = function(array, oldIndex, newIndex) {

			array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
			return array;
	}

	$scope.setAsDefault = function(loc){
		var index = $scope.clubLocations.indexOf(loc);
		move($scope.clubLocations,index,0);
	}

	$scope.saveClubLocations = function(){

		clubService.getClubLocations($scope.selected_club).then(function(response){
			clubService.saveClubLocations($scope.clubLocations, response._etag,response._id).then(function(response) {
				$scope.loc = null;
			});
    	});
	};

	$scope.removeLocation = function(location){
		var index = $scope.clubLocations.indexOf(location);
		if(index >-1){
			$scope.clubLocations.splice(index,1);
		}
		$scope.loc = null;
	};

	$scope.rowClicked = function(location){

		$scope.loc=location;
		$scope.coords=[$scope.loc.geo.coordinates[0],$scope.loc.geo.coordinates[1]];
		$scope.zoom=13;
	};


	$scope.dragMarker = function(event,location){

		$scope.loc.geo.coordinates[0]=event.latLng.lat();
		$scope.loc.geo.coordinates[1]=event.latLng.lng();
		$scope.coords=[$scope.loc.geo.coordinates[0],$scope.loc.geo.coordinates[1]];


	};
	$scope.clickRedMarker = function(event,location){
		$scope.zoom=13;
		$scope.coords=[$scope.loc.geo.coordinates[0],$scope.loc.geo.coordinates[1]];

	};

	$scope.clickMarker = function(event,location){

		$scope.loc=location;
		$scope.zoom=13;
		$scope.coords=[$scope.loc.geo.coordinates[0],$scope.loc.geo.coordinates[1]];
	};



}]);
