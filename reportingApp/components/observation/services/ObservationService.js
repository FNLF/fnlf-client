(function () {

	angular.module('reportingApp')
		.service('ObservationService', function (RestService,Definitions,$rootScope) {

			function Observation() {
				this.id;
				this.when = new Date();
				this.involved = [];
				this.organization={};
				this.rating = {};
				this.weather = {};
				this.components = [];
				this.files=[];
				this.related = [];
				this.tags = [];
				this.comments = [];
				this.actions = {};
			};



			var observation = new Observation();

			this.setObservation = function (selectedObservation) {
				observation = selectedObservation;
			};
			this.getObservation = function () {
				return observation;
			};


			this.createObservation = function () {



			};


			this.setTitle = function(obs){
				var tagText = '';
				if(obs.tags){
					obs.tags.forEach(function(t){
						tagText = tagText +' '+t;
					});
				}

				var dateText = '';
				if(obs.when){
					dateText = obs.when.format('yyyy-mm-dd');
				}else{
					dateText = obs._created;
				}

				obs.title = dateText + ' ' + tagText

			};

			this.copy  = function(firstObject,secondObject){

				for(var k in firstObject){
					secondObject[k]=firstObject[k];
				}
			};
			var copyFunction = this.copy;
			var setTitleFunction = this.setTitle;

			this.updateObservation = function () {
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
							console.log(observation);
							copyFunction(updated,observation);
							console.log(observation);
							setTitleFunction(observation);
						});
				}).error(function(error){
					console.log(error);
					$rootScope.error=error;
					RestService.getObservation(_id)
						.success(function(updated){
							console.log(observation);
							copyFunction(updated,observation);
							console.log(observation);
							setTitleFunction(observation);
						});
				});
			};

			this.clearObservation = function () {
				observation = new Observation();
			};




		});


})();