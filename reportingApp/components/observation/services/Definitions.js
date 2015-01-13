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
				observationTypes.push(new ObservationType('1', 'Næruhell'));
				observationTypes.push(new ObservationType('2', 'Uhell'));
				observationTypes.push(new ObservationType('3', 'Ulykke'));

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
