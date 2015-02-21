	
angular.module('resolve').service('ResolveService', function ($http, $q) {
	
	var urlBase = '/api/v1';
	
	
	this.getClub = function(clubid) {
		
		var request = $http({
			method : "get",
			url : urlBase + '/melwin/clubs/' + clubid + '?projection={"name": 1}',
		});
		return (request.then(handleSuccess, handleError));
	
	};
	
	
	this.getUser = function(userid) {
		console.log("Resolve SERVICE");
		var request = $http({
			method : "get",
			url : urlBase + '/melwin/users/' + userid + '?projection={"firstname": 1, "lastname": 1}',
		});
		return (request.then(handleSuccess, handleError));

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
	
});