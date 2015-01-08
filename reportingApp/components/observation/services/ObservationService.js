(function () {

	angular.module('reportingApp')
		.service('ObservationService', function (RestService) {

			function ObservationType(id, name) {
				this.id = id;
				this.name = name;
			};

			function ObservationTypeOption(id, name) {
				this.id = id;
				this.name = name;
			};

			function Club(id, name) {
				this.id = id;
				this.name = name;
			};

			function Location(id, name) {
				this.id = id;
				this.name = name;
			};


			function Observation() {

			};

			Observation.prototype.involved = [];
			Observation.prototype.club = new Club("", "");
			Observation.prototype.location = new Location("", "");
			Observation.prototype.observationType = new ObservationType("", "");
			Observation.prototype.dateTime = new Date();
			Observation.prototype.incidents = [];


			var observation = new Observation();

			this.setObservation = function (selectedObservation) {
				observation = selectedObservation;
			};
			this.getObservation = function () {
				return observation;
			};


			this.saveObservation = function () {
				observation = RestService.saveAnomaly(observation);
			};
			this.updateObservation = function () {
				RestService.updateAnomaly(observation);
			};
			this.clearObservation = function () {
				observation = new Observation();
			};


			this.deleteAnomaly = function () {
				anomaly = {};
			};


			this.getObservationTypes = function () {
				var observationTypes = [];
				observationTypes.push(new ObservationType('1', 'Næruhell'));
				observationTypes.push(new ObservationType('2', 'Uhell'));
				observationTypes.push(new ObservationType('3', 'Ulykke'));
				return observationTypes;
			};

			this.getObservationTypeOptions = function () {
				var observationTypeOptions = [];
				observationTypeOptions.push(new ObservationTypeOption('personskade', 'Personskade'));
				observationTypeOptions.push(new ObservationTypeOption('reserveskjerm', 'Reserveskjerm benyttet'));
				observationTypeOptions.push(new ObservationTypeOption('bevisst', 'Bevisst handling'));
				return observationTypeOptions;
			};

		});


})();