(function () {

	angular.module('reportingApp')
		.service('PersonQueryService', ['$http', function ($http) {
			var urlBase = '/api/v1';
			this.getPersonsByName = function (name) {
				return $http.get(urlBase + '/melwin/users/search?q=' + name)
			};

		}]);

})();