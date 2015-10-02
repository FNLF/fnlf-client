angular.module("profileApp")
	.service("userService",['$http','$q','$rootScope', function($http, $q, $rootScope) {

		var urlBase = '/api/v1';


		/**
		 * Change workflow state if access
		 *
		 *
		 */
		this.getUser = function() {

			var request = $http({
				method : "get",
				url : urlBase + '/users/' + $rootScope.username,
			});
			return (request.then(handleSuccess, handleError));

		};

		this.saveUser = function(data, _id, _etag) {

			var config = {};
			config.headers = {};
			config.headers['If-Match'] = _etag;
			config.headers['Content-Type'] = 'application/json';

			var request = $http({
				method : "patch",
				headers: config.headers,
				data: data,
				url : urlBase + '/users/' + _id,
			});
			return (request.then(handleSuccess, handleError));

		};

		this.getMelwinUser = function() {

			var request = $http({
				method : "get",
				url : urlBase + '/melwin/users/' + $rootScope.username,
			});
			return (request.then(handleSuccess, handleError));

		};

		this.getClubs = function(clubs) {

			var request = $http({
				method : "get",
				url : urlBase + '/clubs/?where={"id": {"\$in": ' + JSON.stringify(clubs) + '}}&projection={"id": 1, "name": 1}'
			});
			return (request.then(handleSuccess, handleError));

		};

		this.getUserAvatar = function() {

			var request = $http({
				method : "get",
				url : urlBase + '/users/' + $rootScope.username +'?projection={\"avatar\": 1}',
			});
			return (request.then(handleSuccess, handleError));

		};


		this.getAcl = function(where){
			if(!where){
				where = {};
			}
			return $http.get(urlBase+'/users/acl/?where='+JSON.stringify(where)).then(handleSuccess, handleError);
		};

		this.getRole = function(_id){
			return $http.get(urlBase+'/acl/roles/'+_id).then(handleSuccess, handleError);
		};

		this.getGroup = function(_id){
			return $http.get(urlBase+'/acl/groups/'+_id).then(handleSuccess, handleError);
		};

		// updating person - no $scope, no injection allowable???
		this.updateInfo = function(personIndex, obj) {
			$scope.userArray.splice(personIndex, 1, obj);
		};

		this.getUserId = function() {

			return $rootScope.userid;
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