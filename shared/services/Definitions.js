(function () {

	angular.module('fnlf-services')
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
				
				var ows = {'withdrawn': 'Trekt tilbake', 'draft': 'Utkast','pending_review_hi': 'Avventer HI' ,'pending_review_fs': 'Avventer Fagsjef', 'pending_review_su': 'Avventer SU','closed': 'Lukket' };
				return ows;
			};
			
			this.resolveObservationWorkflowState = function(state) {
				
				return this.getObservationWorkflowStates()[state];
			};


			this.getObservationTypeMap = function() {
				var types = {'sharing': 'Erfaringsdeling', 'unwanted_act': 'Uønsket', 'near_miss': 'Næruhell', 'incident': 'Uhell', 'accident': 'Ulykke'};
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


			this.getComponentAttributes = function(){
			    return [//{attribute:'attitude',color:'primary',label:'Holdninger'},
						//{attribute:'skills',color:'primary',label:'Ferdigheter'},
						//{attribute:'knowledge',color:'primary',label:'Kunnskap'},
						{attribute:'reserve_ride',color:'info',label:'Reserve benyttet'},
                        {attribute:'aad_fire',color:'warning',label:'Nødåpner fyrt'},
						{attribute:'aad_rescue',color:'warning',label:'Nødåpner-redning'},
                        {attribute:'packing_error',color:'default',label:'Pakkefeil'},
                        {attribute:'gear_malfunction',color:'default',label:'Feilfunksjon'},
                        {attribute:'damage',color:'default',label:'Matriell skade'},
                        {attribute:'gear_failure',color:'default',label:'Utstyrsvikt'},
                        {attribute:'rigger_error',color:'warning',label:'MK/MR Feil'},
                        {attribute:'violation',color:'default',label:'Regelbrudd'},
                        {attribute:'injury',color:'warning',label:'Personskade'},
                        {attribute:'death',color:'warning',label:'Død'}];

			};
			
			this.getRatingScale = function() {
				
				return [null, 'Alt OK','Til ettertanke', 'Mindre skade', 'Middels skade', 'Alvorlig skade', 'Alvorlig skade/men', 'Død', 'Flere døde'];
			};

			this.tagsMapping = function(){

				var mapping = {}; //mapping from db-model param name to list of tag group names
				mapping['tags'] = ['observation'];
				mapping['components.tags'] = ['component'];
				mapping['components.what'] = ['component.what.cause', 'component.what.consequence', 'component.what.incident'];
				mapping['components.where.at'] = ['where-at'];
				mapping['involved.jumptypeTags'] = ['jumptypes'];
				mapping['involved.aircraft'] = ['aircraftTypes'];
				mapping['involved.gear.mainCanopyType'] = ['maincanopies'];
				mapping['involved.gear.reserveCanopyType'] = ['reserveCanopies'];
				mapping['involved.gear.harnessType'] = ['harnessTypes'];
				mapping['involved.gear.aadType'] = ['aadType'];
				mapping['involved.gear.other'] = ['otherEquipment'];

				return mapping;
			};


		});


})();
