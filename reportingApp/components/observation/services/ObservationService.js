(function () {

	angular.module('reportingApp')
		.service('ObservationService', function (RestService,Definitions) {

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
					dateText = obs.when;
				}else{
					dateText = obs._created;
				}

				obs.title = dateText + ' ' + tagText

			};

			var setTitleFunction = this.setTitle;

			this.updateObservation = function () {
				var _id = observation._id;
				var _etag = observation._etag;


				delete observation.id;
				delete observation.reporter;
				delete observation.owner;
				delete observation.wilfull;

				delete observation.title;
				delete observation._updated;
				delete observation._latest_version;
				delete observation.audit;
				delete observation.watchers;
				delete observation._version;
				delete observation.workflow;
				delete observation._links;
				delete observation._created;
				delete observation._status;
				delete observation._etag;
				delete observation._id;


				RestService.updateObservation(observation, _id, _etag)
				.success(function(data){
					RestService.getObservation(_id)
						.success(function(updated){
							console.log(observation);
							observation = updated;
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