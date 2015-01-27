(function () {

	angular.module('reportingApp')
		.service('LocationService', ['$http', function ($http) {
			var urlBase = '/api/v1/locations/search?';

			   var config = {headers: {
                        'Accept': 'application/json'
                    }
                };

				this.getPlaceNames = function (name) {
					return $http.get(urlBase+'q=' + name,config);
	 			};

		}]);

})();