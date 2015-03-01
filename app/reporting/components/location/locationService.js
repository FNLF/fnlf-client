(function () {

	angular.module('reportingApp')
		.service('LocationService', ['$http', function ($http) {
			var urlBase = '/api/v1/';

			   var config = {headers: {
                        'Accept': 'application/json'
                    }
                };
			   

				this.getPlaceNames = function (name, club) {
					
					return $http.get(urlBase+'locations/search?q=' + name,config);
	 			};
	 			
	 			this.getClubLocations = function (club) {
	 				
	 				// Default places:
					return $http.get(urlBase+'clubs/' + club + '?projection={"locations": 1}' ,config).then(handleSuccess, handleError);
	 			};
	 			
	 			this.saveClubLocations = function(club, locations, etag, id) {
	 				
	 				config.headers['If-Match'] = etag;
	 				config.headers['Content-Type'] = 'application/json';
	 				return $http({ method: 'PATCH', url: urlBase+'clubs/' + id, data: {locations: locations}, headers: config.headers});
	 				
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

		}]);

})();