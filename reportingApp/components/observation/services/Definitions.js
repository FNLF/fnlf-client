(function () {

	angular.module('reportingApp')
		.service('Definitions', function () {


			function ObservationType(id, name) {
				this.id = id;
				this.name = name;
			};

			function ObservationTypeOption(id, name) {
				this.id = id;
				this.name = name;
			};


			this.getObservationTypes = function () {
				var observationTypes = [];
				
				observationTypes.push(new ObservationType('sharing', 'Erfaringsdeling'));
				observationTypes.push(new ObservationType('unsafe_act', 'Uheldig hendelse'));
				observationTypes.push(new ObservationType('near_miss', 'Næruhell'));
				observationTypes.push(new ObservationType('incident', 'Uhell'));
				observationTypes.push(new ObservationType('accident', 'Ulykke'));

				return observationTypes;
			};


			this.getObservationTypeOptions = function () {
				var observationTypeOptions = [];
				observationTypeOptions.push(new ObservationTypeOption('injury', 'Personskade'));
				observationTypeOptions.push(new ObservationTypeOption('reserveCanopyUsed', 'Reserveskjerm benyttet'));
				observationTypeOptions.push(new ObservationTypeOption('willful', 'Bevisst handling'));
				return observationTypeOptions;
			};


		});


})();
