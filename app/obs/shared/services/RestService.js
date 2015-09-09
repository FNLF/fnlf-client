(function () {

	angular.module('reportingApp')
		.service('RestService', ['$http','$q', function ($http,$q) {
			var urlBase = '/api/v1';

			this.getClubs = function () {
				return $http.get(urlBase + "/clubs?where={\"active\":true}")
					.then(handleSuccess, handleError);
			};
			
			this.getClub = function (id) {
				return $http.get(urlBase + "/clubs/" + id)
					.then(handleSuccess, handleError);
			};

			this.getLicenses = function () {
				return $http.get(urlBase + '/melwin/licenses')
					.then(handleSuccess, handleError);
			};

			this.getJumpTypes = function () {
				return $http.get(urlBase + "/jumps/categories")
					.then(handleSuccess, handleError);
			};

			this.createObservation = function (observation) {
				return $http.post(urlBase + '/observations', observation)
					.then(handleSuccess, handleError);
			};
			
			this.getObservation = function (id) {
				return $http.get(urlBase + '/observations/'+id)
					.then(handleSuccess, handleError);
			};

			this.getObservationById = function (id) {
				return $http.get(urlBase + '/observations/'+id)
					.then(handleSuccess, handleError);
			};

			this.getObservations = function (page,maxResults,sort,userName) {
				return $http.get(urlBase + '/observations/?where={"watchers": {"$in": ['+userName+']}}&sort='+sort+'&max_results='+maxResults+'&page='+page)
					.then(handleSuccess, handleError);
			};

			this.getAllObservations = function (page,maxResults,sort,where) {
				return $http.get(urlBase + '/observations/?sort='+sort+'&max_results='+maxResults+'&page='+page+'&'+where)
					.then(handleSuccess, handleError);
			};



			this.getObservationComponentTemplates = function () {
				return $http.get(urlBase + '/observations/components')
					.then(handleSuccess, handleError);
			};

			this.updateObservationComponentTemplate = function (template,_id,_etag) {
				var config = {};
				config.headers = {};
				config.headers['If-Match'] = _etag;

            	var url = urlBase + '/observations/components/' + _id;
            	return $http({ method: 'PATCH', url: url, data: template, headers: config.headers})
					.then(handleSuccess, handleError);
			};

			this.createObservationComponentTemplate = function (template) {
				return $http.post(urlBase + '/observations/components/',template)
					.then(handleSuccess, handleError);
			};


			this.updateObservation = function (observation, _id, etag) {



				var config = {};
				config.headers = {};
				config.headers['If-Match'] = etag;

				var url = urlBase + '/observations/' + _id;
				return $http({ method: 'PATCH', url: url, data: observation, headers: config.headers})
					.then(handleSuccess, handleError);
			};


			this.getUserByName = function (name) {
				return $http.get(urlBase + '/melwin/users/search?q=' + name)
					.then(handleSuccess, handleError);
			};

			this.getUserDetails = function (userId){
				return $http.get(urlBase + '/melwin/users/' + userId)
					.then(handleSuccess, handleError);
			};
			
			this.getUser = function(userId) {
				return $http.get(urlBase + '/users/' + userId)
					.then(handleSuccess, handleError);
			};
			
			
			/**
			 * Workflows here!
			 */
			this.getWorkflowState = function (objectId){
				return $http.get(urlBase + '/observations/workflow/' + objectId + '/state')
					.then(handleSuccess, handleError);
			};
			
			this.getWorkflowTodo = function (page,maxResults,sort){
				return $http.get(urlBase + '/observations/workflow/todo?sort='+sort+'&max_results='+maxResults+'&page='+page)
					.then(handleSuccess, handleError);
			};
			
			this.changeWorkflowState = function (objectId, action, comment){
				return $http.post(urlBase + '/observations/workflow/' + objectId + '/' + action, {'comment': comment})
					.then(handleSuccess, handleError);
			};
			
			/**
			 * Watching/watchers
			 * 
			 */
			this.isWatching = function (objectId){
				return $http.get(urlBase + '/observations/watchers/' + objectId + '/watching')
					.then(handleSuccess, handleError);
			};
			this.getWatchers = function (objectId){
				return $http.get(urlBase + '/observations/watchers/' + objectId + '/watchers')
					.then(handleSuccess, handleError);
			};
			this.startWatching = function (objectId){
				return $http.post(urlBase + '/observations/watchers/' + objectId + '/start')
					.then(handleSuccess, handleError);
			};
			this.stopWatching = function (objectId){
				return $http.post(urlBase + '/observations/watchers/' + objectId + '/stop')
					.then(handleSuccess, handleError);
			};

			/**
			 * Tags
			 */

			this.getAllTags = function(page,sort){
				return $http.get(urlBase + '/tags?sort='+sort+'&max_results=200&page='+page)
					.then(handleSuccess, handleError);
			};


			this.getTagsByRegex = function(text,group){
				return $http.get(urlBase + '/tags/?where={"group":"'+group+'", "tag":{"$regex":".*'+text+'.*"}}&sort=-freq')
					.then(handleSuccess, handleError);
			};

			this.getTags = function(group){
				return $http.get(urlBase + '/tags/?where={"group":"'+group+'", "freq":{"$gt":0}}&sort=-freq&max_results=50')
					.then(handleSuccess, handleError);
			};

			this.getMostPopularTags = function(group){
				return $http.get(urlBase + '/tags/?where={"group":"'+group+'"}&sort=-freq&max_results=6')
					.then(handleSuccess, handleError);
			};

			var getExistingTags = function(tag,group){
				return $http.get(urlBase + '/tags/?where={"tag":"'+tag+'","group":"'+group+'"}')
					.then(handleSuccess, handleError);
			};

			this.removeTag = function(tag,group){

				if(!angular.isUndefined(tag) && !angular.isUndefined(group)) {
					getExistingTags(tag, group)
						.then(function (data) {
						if (data._meta.total == 0) {

						} else {
							console.log("Decrementing tag " + tag + " freq ("+group+")");
							for(var i =0; i < 10; i++) {
								$http.delete(urlBase + '/tags/freq/' + data._items[0]._id, {tag: tag, group: group});
							}
						}

					});
				}else{
					console.log("Tag or group was undefined");
				}

			};


			this.addTag = function(tag,group){
				if(!angular.isUndefined(tag) && !angular.isUndefined(group)) {
					getExistingTags(tag, group)
						.then(function (data) {
						if (data._meta.total == 0) {
							console.log("Adding new tag " + tag+ ' ('+group+')');
							$http.post(urlBase + '/tags', {tag: tag, group: group});
						} else {
							console.log("Incrementing tag " + tag + " freq ("+group+")");
							$http.post(urlBase + '/tags/freq/' + data._items[0]._id, {tag: tag, group: group});
						}

					});
				}else{
					console.log("Tag or group was undefined");
				}

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
				console.log(response.data);
				return (response.data);
			}



		}]);

})();