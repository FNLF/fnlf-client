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
