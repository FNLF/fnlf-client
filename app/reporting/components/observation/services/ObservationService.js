(function () {

	angular.module('reportingApp')
		.service('ObservationService', function (RestService,Definitions,$rootScope) {

			function Observation() {
				this.involved = [];
				this.location={};
				this.organization={};
				this.organization.hl=[];
				this.organization.hm=[];
				this.organization.hfl=[];
				this.rating = {};
				this.weather = {};
				this.components = [];
				this.files=[];
				this.related = [];
				this.tags = [];
				this.comments = [];
				this.actions = {};
				this.type = 'near_miss';
			};


			this.initObservation = function(obsevation){

				var prototypeObs = new Observation();

				for(var k in prototypeObs){
					if(angular.isUndefined(obsevation[k])){
						obsevation[k]=prototypeObs[k];
					}
				}

			}

			var observation = new Observation();

			this.setObservation = function (selectedObservation) {
				observation = selectedObservation;
			};
			this.getObservation = function () {
				return observation;
			};




			this.getObservationById = function (id,callback) {

				RestService.getObservationById(id)
					.success(function(obs){
						callback(obs);
					});
			};


			this.createObservation = function () {



			};




			this.copy  = function(firstObject,secondObject){

				for(var k in firstObject){
					secondObject[k]=firstObject[k];
				}
				console.log('copy');
				console.log(firstObject);
				console.log(secondObject);

			};
			var copyFunction = this.copy;


			this.updateObservation = function (observation,callback) {
				var _id = observation._id;
				var _etag = observation._etag;

				var observationDto = {};
				copyFunction(observation,observationDto);

				delete observationDto.id;
				delete observationDto.reporter;
				delete observationDto.owner;
				delete observationDto.wilfull;

				delete observationDto.title;
				delete observationDto._updated;
				delete observationDto._latest_version;
				delete observationDto.audit;
				delete observationDto.watchers;
				delete observationDto._version;
				delete observationDto.workflow;
				delete observationDto._links;
				delete observationDto._created;
				delete observationDto._status;
				delete observationDto._etag;
				delete observationDto._id;


				RestService.updateObservation(observationDto, _id, _etag)
				.success(function(data){
					RestService.getObservation(_id)
						.success(function(updated){
							callback(updated);
						});
				}).error(function(error){
					console.log(error);
					$rootScope.error=error;
					RestService.getObservation(_id)
						.success(function(updated){
							callback(updated);

						});
				});
			};

			this.clearObservation = function () {
				observation = new Observation();
			};

			/**
			 * Change workflow state if access
			 * 
			 * 
			 */
			this.changeWorkflowState = function (objectId, action, comment,callback){
				
				RestService.changeWorkflowState(objectId, action, comment)
				.success(function(data){
					RestService.getObservation(objectId)
						.success(function(updated){
							callback(updated);

						});
				}).error(function(error){
					console.log(error);
					$rootScope.error=error;
					RestService.getObservation(objectId)
						.success(function(updated){
							callback(updated);

						});
				});
			};
			
			/**
			 * Watching start/stop
			 */
			
			this.isWatching = function(objectId) {
				
				
			};
			
			this.stopWatching = function(objectId) {
				
			};
			

		});


})();