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


			this.getObservationTypes = function () {
				var observationTypes = [];
				
				observationTypes.push(new ObservationType('sharing', 'Erfaringsdeling', 'Del en observasjon av noe bra eller dårlig'));
				observationTypes.push(new ObservationType('unsafe_act', 'Uønsket hendelse', 'Alle de tingene som oppstår som er uønsket eller uheldige'));
				observationTypes.push(new ObservationType('near_miss', 'Næruhell', 'Næruhell som definert i HB'));
				observationTypes.push(new ObservationType('incident', 'Uhell', 'Personskade - oppsøker legehjelp'));
				observationTypes.push(new ObservationType('accident', 'Ulykke', 'Død eller varige men'));

				return observationTypes;
			};


			this.getObservationTypeOptions = function () {
				var observationTypeOptions = [];
				observationTypeOptions.push(new ObservationTypeOption('injury', 'Personskade'));
				observationTypeOptions.push(new ObservationTypeOption('reserveCanopyUsed', 'Reserveskjerm benyttet'));
				observationTypeOptions.push(new ObservationTypeOption('willful', 'Bevisst handling'));
				return observationTypeOptions;
			};


			this.componentAttributesFromTags = function(tags){

				var attributes = {};

				angular.forEach(tags,function(tag){
					if(tag=='Feilfunksjon'){
						attributes.gear_malfunction=true;
					}

					if(tag=='Regelbrudd'){
						attributes.violation=true;
					}

					if(tag=='Med hensikt'){
						attributes.wilfull=true;
					}

					if(tag=='Matriell skade'){
						attributes.damage=true;
					}

					if(tag=='Død'){
						attributes.death=true;
					}

					if(tag=='Utstyrsvikt'){
						attributes.gear_failure=true;
					}

					if(tag=='Personskade'){
						attributes.injury=true;
					}

				});
				return attributes;
			};




			this.componentTagsFromAttributes = function(attributes){
				var tags = [];

				if(angular.isUndefined(attributes)){
					return tags;
				}

				if(attributes.gear_malfunction){
					tags.push('Feilfunksjon');
				}

				if(attributes.violation){
					tags.push('Regelbrudd');
				}

				if(attributes.wilfull){
					tags.push('Med hensikt');
				}

				if(attributes.damage){
					tags.push('Matriell skade');
				}

				if(attributes.death){
					tags.push('Død');
				}

				if(attributes.gear_failure){
					tags.push('Utstyrsvikt');
				}

				if(attributes.injury){
					tags.push('Personskade');
				}

				return tags;
			};

			this.getComponentTags = function(){
				return ['Feilfunksjon','Regelbrudd','Med hensikt','Matriell skade','Død','Utstyrsvikt','Personskade'];
			};


		});


})();
