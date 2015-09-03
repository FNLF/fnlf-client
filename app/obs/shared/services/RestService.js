(function () {

	angular.module('reportingApp')
		.service('RestService', ['$http', function ($http,$rootScope) {
			var urlBase = '/api/v1';

			this.getClubs = function () {
				return $http.get(urlBase + "/clubs?where={\"active\":true}"); //projection={\"id\": 1, \"name\": 1}");
			};
			
			this.getClub = function (id) {
				return $http.get(urlBase + "/clubs/" + id); //projection={\"id\": 1, \"name\": 1}");
			};

			this.getLicenses = function () {
				return $http.get(urlBase + '/melwin/licenses');
			};

			this.getJumpTypes = function () {
				return $http.get(urlBase + "/jumps/categories");
			};

			this.createObservation = function (observation) {
				return $http.post(urlBase + '/observations', observation);
			};
			
			this.getObservation = function (id) {
				return $http.get(urlBase + '/observations/'+id);
			};

			this.getObservationById = function (id) {
				return $http.get(urlBase + '/observations/'+id);
			};

			this.getObservations = function (page,maxResults,sort,userName) {
				return $http.get(urlBase + '/observations/?where={"watchers": {"$in": ['+userName+']}}&sort='+sort+'&max_results='+maxResults+'&page='+page);
			};

			this.getAllObservations = function (page,maxResults,sort) {
				return $http.get(urlBase + '/observations/?sort='+sort+'&max_results='+maxResults+'&page='+page);
			};



			this.getObservationComponentTemplates = function () {
				return $http.get(urlBase + '/observations/components');
			};

			this.updateObservationComponentTemplate = function (template,_id,_etag) {
				var config = {};
				config.headers = {};
				config.headers['If-Match'] = _etag;

            	var url = urlBase + '/observations/components/' + _id;
            	return $http({ method: 'PATCH', url: url, data: template, headers: config.headers});
			};

			this.createObservationComponentTemplate = function (template) {
				return $http.post(urlBase + '/observations/components/',template);
			};


			this.updateObservation = function (observation, _id, etag) {



				var config = {};
				config.headers = {};
				config.headers['If-Match'] = etag;

				var url = urlBase + '/observations/' + _id;
				return $http({ method: 'PATCH', url: url, data: observation, headers: config.headers});
				//return $http.patch(url, observation,config);
			};

			this.getManufacturers = function () {
				return $http.get(urlBase + '/gear/manufacturers/');
			};

			this.getUserByName = function (name) {
				return $http.get(urlBase + '/melwin/users/search?q=' + name);
			};

			this.getUserDetails = function (userId){
				return $http.get(urlBase + '/melwin/users/' + userId);
			};
			
			this.getUser = function(userId) {
				return $http.get(urlBase + '/users/' + userId);
			};
			
			
			/**
			 * Workflows here!
			 */
			this.getWorkflowState = function (objectId){
				return $http.get(urlBase + '/observations/workflow/' + objectId + '/state');
			};
			
			this.getWorkflowTodo = function (page,maxResults,sort){
				return $http.get(urlBase + '/observations/workflow/todo?sort='+sort+'&max_results='+maxResults+'&page='+page);
			};
			
			this.changeWorkflowState = function (objectId, action, comment){
				return $http.post(urlBase + '/observations/workflow/' + objectId + '/' + action, {'comment': comment});
			};
			
			/**
			 * Watching/watchers
			 * 
			 */
			this.isWatching = function (objectId){
				return $http.get(urlBase + '/observations/watchers/' + objectId + '/watching');
			};
			this.getWatchers = function (objectId){
				return $http.get(urlBase + '/observations/watchers/' + objectId + '/watchers');
			};
			this.startWatching = function (objectId){
				return $http.post(urlBase + '/observations/watchers/' + objectId + '/start');
			};
			this.stopWatching = function (objectId){
				return $http.post(urlBase + '/observations/watchers/' + objectId + '/stop');
			};

			/**
			 * Tags
			 */

			this.getAllTags = function(page,sort){
				return $http.get(urlBase + '/tags?sort='+sort+'&max_results=200&page='+page);
			};


			this.getTagsByRegex = function(text,group){
				return $http.get(urlBase + '/tags/?where={"group":"'+group+'", "tag":{"$regex":".*'+text+'.*"}}&sort=-freq');
			};

			this.getTags = function(group){
				return $http.get(urlBase + '/tags/?where={"group":"'+group+'"}&sort=-freq');
			};

			this.getMostPopularTags = function(group){
				return $http.get(urlBase + '/tags/?where={"group":"'+group+'"}&sort=-freq&max_results=6');
			};

			var getExistingTags = function(tag,group){
				return $http.get(urlBase + '/tags/?where={"tag":"'+tag+'","group":"'+group+'"}');
			};

			this.removeTag = function(tag,group){

				if(!angular.isUndefined(tag) && !angular.isUndefined(group)) {
					getExistingTags(tag, group).success(function (data) {
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
					getExistingTags(tag, group).success(function (data) {
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



		}]);

})();