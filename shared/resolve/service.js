	
angular.module('resolve').service('ResolveService', function ($http, $q) {
	
	var urlBase = '/api/v1';


	this.resolveObservationWorkflowState = function(state) {
		var ows = {'draft': 'Draft', 'ready': 'Klar', 'withdrawn': 'Trekt tilbake', 'closed': 'Lukket', 'pending_review_hi': 'Avventer HI', 'pending_review_fs': 'Avventer Fagsjef', 'pending_review_su': 'Avventer SU'};
		return ows[state];
	};

	
	this.resolveObservationType = function(type) {
		
		var types = {'sharing': 'Erfaringsdeling', 'unwanted_act': 'Uønsket hending', 'near_miss': 'Næruhell', 'incident': 'Uhell', 'accident': 'Ulykke'};
		return types[type];
	};
	
	this.resolveObservationFlag= function(type) {
		
		var types = {'aviation': 'Luftfartshendelse', 'insurance': 'Forsikringssak'};
		return types[type];
	};
	
	this.getClub = function(clubid) {
		
		var request = $http({
			method : "get",
			url : urlBase + '/melwin/clubs/' + clubid + '?projection={"name": 1}',
			cache: true
		});
		return (request.then(handleSuccess, handleError));
	
	};

	this.getLicense = function (id) {
		var request = $http({
			method : "get",
			url : urlBase + '/melwin/licenses/' + id,
			cache: true
		});
		return (request.then(handleSuccess, handleError));
		
	};
	
	this.getUser = function(userid) {
		var request = $http({
			method : "get",
			url : urlBase + '/melwin/users/' + userid + '?projection={"firstname": 1, "lastname": 1}',
			cache: true
		});
		return (request.then(handleSuccess, handleError));

	};
	this.getUserAvatar = function(userid) {
		
		var request = $http({
			method : "get",
			url : urlBase + '/users/' + userid +'?projection={\"avatar\": 1}',
			cache: false
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
		return (response.data);
	};
	
});