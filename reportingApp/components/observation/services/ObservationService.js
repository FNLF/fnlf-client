(function () {

	angular.module('reportingApp')
		.service('ObservationService', function (RestService,Definitions) {






			function Observation() {
				this.id;
				this.title;
				this.type = Definitions.getObservationTypes()[0];
				this.wilfull = false;
				this.owner = 0;
				this.reporter = 0;
				this.when = Date.now();
				this.involved = [];
				this.organisation={};
				this.rating = 0;
				this.weather = {};
				this.components = [];
				this.files=[];
				this.freetext={};
				this.related = [];
				this.tags = [];
				this.comments = [];
				this.workflow = [];
				this.watchers = [];
				this.actions = {};
				this.audit = {};
				this.acl = {};



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
			this.updateObservation = function () {
				RestService.updateObservation(observation);
			};

			this.clearObservation = function () {
				observation = new Observation();
			};




		});


})();