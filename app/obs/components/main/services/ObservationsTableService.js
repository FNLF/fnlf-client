(function () {

	angular.module('reportingApp')
		.service('ObservationsTableService', function (ngTableParams,RestService,$q,Definitions, ObservationService, $location) {

			this.getTags = function () {
				console.log("GET TAGS");
				var def = $q.defer();
				var tags = [{title: 'Reservetrekk', id: 'Reservetrekk'}];
				def.resolve(tags);
				return def;

			};

			this.getClubs = function () {
				console.log("GET CLUBS");
				var def = $q.defer();

				RestService.getClubs().then(function (r) {
					var data = r.data;
					var items = data._items;
					var clubs = items.map(function (club) {
						return {id: club.id, title: club.name};
					});
					def.resolve(clubs);
				});

				//var clubs = [{title:'VFSK',id:'F-001'}];
				//return clubs;

				return def;
			};

			this.getTypes = function(){

				var objs = Definitions.getObservationTypeMap();
				var arr = [];
				Object.keys(objs).forEach(function (key) {
					var value = objs[key];
					arr.push({id:key,title:value});
				});
				return arr;
			};

			this.getWorkflowStates = function(){
				var objs =  Definitions.getObservationWorkflowStates();
				var arr = [];
				Object.keys(objs).forEach(function (key) {
					var value = objs[key];
					arr.push({id:key,title:value});
				});
				return arr;
			};

			this.getRatings = function(){
				var arr = [];
				arr.push({id:1,title:'>1'});
				arr.push({id:1,title:'>2'});
				arr.push({id:1,title:'>3'});
				arr.push({id:1,title:'>4'});
				arr.push({id:1,title:'>5'});
				arr.push({id:1,title:'>6'});
				arr.push({id:1,title:'>7'});
				arr.push({id:1,title:'>8'});
				arr.push({id:1,title:'>9'});

				return arr;
			};


			this.sortStringFromParams = function(params){
					var sortString = "-id";
					angular.forEach(params.sorting(), function (k, v) {
						if (k == 'desc') {
							sortString = '-' + v;
						}
						if (k == 'asc') {
							sortString = v;
						}

					});
					return sortString;
			};


		});
})();