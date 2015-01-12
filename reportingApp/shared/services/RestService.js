(function () {

	angular.module('reportingApp')
		.service('RestService', ['$http', function ($http) {
			var urlBase = '/api/v1';

			this.getClubs = function () {
				return $http.get(urlBase + "/clubs?where={\"active\":true}&max_results=50");
			};

			this.getLicenses = function () {
				return $http.get(urlBase + '/melwin/licenses');
			};

			this.getJumpTypes = function () {
				return $http.get(urlBase + "/jumps/categories");
			};

			this.saveObservation = function (observation) {
				return $http.post(urlBase + '/observations', observation);
			};
			this.getObservations = function () {
				return $http.get(urlBase + '/observations');
			};
			this.updateObservation = function (observation) {
				return $http.put(urlBase + '/observations/' + observation.id, observation);
			};

			this.getManufacturers = function () {
				return $http.get(urlBase + '/gear/manufacturers/');
			};

			this.getUserByName = function (name) {
				return $http.get(urlBase + '/melwin/users/search?q=' + name)
			};

			this.getUserDetails = function (userId){
				return $http.get(urlBase + '/melwin/users/' + userId);
			};

		}]);

})();