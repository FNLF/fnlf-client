angular.module("clubApp")
	   .service("clubService",['$http','$q','$rootScope', function($http, $q, $rootScope) {

			var urlBase = '/api/v1';

		   var config = {headers: {
					'Accept': 'application/json'
				}
			};


			this.getClubLocations = function (clubId) {

				return $http.get(urlBase+'/clubs/' + clubId + '?projection={"locations": 1}' ,config).then(handleSuccess, handleError);
			};

			this.saveClubLocations = function(locations, etag,id) {
				config.headers['If-Match'] = etag;
				config.headers['Content-Type'] = 'application/json';
				return $http({ method: 'PATCH', url: urlBase+'/clubs/' + id, data: {locations: locations}, headers: config.headers});
			};

			this.getClubs = function() {

				var request = $http({
					method : "get",
					url : urlBase + '/clubs/',
				});
				return (request.then(handleSuccess, handleError));

			};

			this.getClubLogo = function(clubId) {


				var request = $http({
					method : "get",
					url : urlBase + '/clubs/' + clubId +'?projection={\"logo\": 1}',
				});
				return (request.then(handleSuccess, handleError));

			};

			// I transform the error response, unwrapping the
			// application dta from
			// the API response payload.
			function handleError(response) {
				// The API response from the server should be
				// returned in a
				// normalized format. However, if the request
				// was not handled by the
				// server (or what not handles properly - ex.
				// server error), then we
				// may have to normalize it on our end, as best
				// we can.
				console.log(response);
				if (!angular.isObject(response.data) || !response.data.message) {
					return ($q.reject("An unknown error occurred."));
				}
				// Otherwise, use expected error message.
				return ($q.reject(response.data.message));
			}
			// I transform the successful response, unwrapping
			// the application data
			// from the API response payload.
			function handleSuccess(response) {
				return (response.data);
			}

		} ]);