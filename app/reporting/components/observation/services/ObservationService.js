(function () {

	angular.module('reportingApp')
		.service('ObservationService', function (RestService,Definitions,Functions,$rootScope) {

			function Observation() {
				this.involved = [];
				this.when = new Date();
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

			
			this.initObservation = function(observation){

				var prototypeObs = new Observation();

				for(var k in prototypeObs){
					if(angular.isUndefined(observation[k])){
						observation[k]=prototypeObs[k];
					}
				}
				
			};

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







			var clearFullname = function(person){
				if(person) {
					delete person.open;
					delete person.fullname;
				}
			};

			function clearFullnameFromObservation(observation){
				angular.forEach(observation.involved,clearFullname);
				angular.forEach(observation.organization.hl,clearFullname);
				angular.forEach(observation.organization.hm,clearFullname);
				angular.forEach(observation.organization.hfl,clearFullname);
				angular.forEach(observation.organization.pilot,clearFullname);
				angular.forEach(observation.components,function(comp){
				angular.forEach(comp.involved,clearFullname);
				});


			};


			this.updateObservation = function (observation,callback) {

				clearFullnameFromObservation(observation);

				var _id = observation._id;
				var id = observation.id;
				var _etag = observation._etag;

				var observationDto = {};
				Functions.copy(observation,observationDto);

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
					RestService.getObservation(id)
						.success(function(updated){
							$rootScope.error = null;
							clearFullnameFromObservation(updated);
							callback(updated);
						});
				}).error(function(error){
					console.log(error);
					$rootScope.error=error;
					RestService.getObservation(id)
						.success(function(updated){
							clearFullnameFromObservation(updated);
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
