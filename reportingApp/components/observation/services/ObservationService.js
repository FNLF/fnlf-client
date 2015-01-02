(function () {

	angular.module('reportingApp')
		.service('ObservationService', function (RestService) {

			function ObservationType(id, name) {
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

			Observation.prototype.involvedPersons = [];
			Observation.prototype.club = new Club("1", "BFSK");
			Observation.prototype.location = {};
			Observation.prototype.observationType = "";
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

				observationTypes.push(new ObservationType('uflaks', 'Uflaks'));
				observationTypes.push(new ObservationType('uforsiktighet', 'Uforsiktighet'));
				observationTypes.push(new ObservationType('uomtenksomhet', 'Uomteksomhet'));
				observationTypes.push(new ObservationType('uforstand', 'Uforstand'));
				observationTypes.push(new ObservationType('ulovlighet', 'Ulovlighet'));


				return observationTypes;
			};

		});


})();