(function () {

	angular.module('reportingApp')
		.service('LocationService', ['$http', function ($http) {
			var urlBase = '/locations/?';

			   var config = {headers: {
                        'Accept': 'application/json'
                    }
                };

				this.getPlaceNames = function (name) {
				return $http.get(urlBase+'navn=' + name + '&maxAnt=8&eksakteForst=true',config)
			};

		}]);

})();