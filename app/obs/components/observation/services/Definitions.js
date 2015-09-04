(function () {

	angular.module('reportingApp')
		.service('Definitions', function () {


			function ObservationType(id, name, descr) {
				this.id = id;
				this.name = name;
				this.descr = descr;
			};

			function ObservationTypeOption(id, name) {
				this.id = id;
				this.name = name;
			};
			
			this.getObservationWorkflowStates = function() {
				
				var ows = {'draft': 'Draft', 'ready': 'Klar', 'withdrawn': 'Trekt tilbake', 'closed': 'Lukket', 'pending_review_hi': 'Avventer HI', 'pending_review_fs': 'Avventer Fagsjef', 'pending_review_su': 'Avventer SU'};
				return ows;
			};
			
			this.resolveObservationWorkflowState = function(state) {
				
				return this.getObservationWorkflowStates()[state];
			};


			this.getObservationTypeMap = function() {
				var types = {'sharing': 'Erfaringsdeling', 'unwanted_act': 'Uønsket hending', 'near_miss': 'Næruhell', 'incident': 'Uhell', 'accident': 'Ulykke'};
				return types;
			};

			this.getObservationTypes = function () {
				var observationTypes = [];
				
				observationTypes.push(new ObservationType('sharing', 'Erfaring', 'Del en observasjon av noe bra eller dårlig'));
				observationTypes.push(new ObservationType('unsafe_act', 'Uønsket', 'Alle de tingene som oppstår som er uønsket eller uheldige'));
				observationTypes.push(new ObservationType('near_miss', 'Næruhell', 'Næruhell som definert i HB'));
				observationTypes.push(new ObservationType('incident', 'Uhell', 'Personskade - oppsøker legehjelp'));
				observationTypes.push(new ObservationType('accident', 'Ulykke', 'Død eller varige men'));

				return observationTypes;
			};
			
			this.resolveObservationTypes = function(id) {
				
				var ot = this.getObservationTypes();
				
				for (i = 0; i < ot.length; i++) {
				    if(ot[i]['id'] == id) return ot[i]['name'];
				}
				
				return '';
				
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
