(function () {

	angular.module('reportingApp')
		.service('LocationService', ['$http', function ($http) {
			var urlBase = '/api/v1/locations/search?';

			   var config = {headers: {
                        'Accept': 'application/json'
                    }
                };

				this.getPlaceNames = function (name, club) {
					
					return $http.get(urlBase+'q=' + name + '&club=' + club,config);
	 			};
	 			
	 			this.getClubLocations = function (club) {
	 				
	 				// Default places:
					var club_locations = $http.get('/api/v1/clubs/' +club ,config);
	 			};

		}]);

})();