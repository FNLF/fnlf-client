(function () {

	angular.module('reportingApp')
		.service('RestService', ['$http', function ($http,$rootScope) {
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
			this.getObservation = function (_id) {
				return $http.get(urlBase + '/observations/'+_id);
			};
			this.getObservations = function (userName) {
				return $http.get(urlBase + '/observations/?where={"watchers": {"$in": ['+userName+']}}');
			};

			this.updateObservation = function (observation,_id,etag) {
				var config = {};
				config.headers = {};
				config.headers['If-Match'] = etag;

				var url = urlBase + '/observations/' + _id;
				return $http({ method: 'PATCH', url: url, data: observation,headers: config.headers});
				//return $http.patch(url, observation,config);
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