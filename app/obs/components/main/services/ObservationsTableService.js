(function () {

	angular.module('reportingApp')
		.service('ObservationsTableService', function (ngTableParams,RestService,$q,Definitions) {

			this.getTags = function () {
				var def = $q.defer();
				RestService.getTags('observation').then(function(data){
						var items = data._items;
						var tags = items.map(function (tag) {
							return {id: tag.tag, title: tag.tag};
						});
						def.resolve(tags)
					});

				return def;
			};

			this.getYears = function(){
				var arr = [];
				arr.push({id:2016,title:'2016'});
				arr.push({id:2015,title:'2015'});
				arr.push({id:2014,title:'2014'});
				arr.unshift({title: ''});
				return arr;
			};

			this.getClubs = function () {
				var def = $q.defer();
				RestService.getClubs().then(function (data) {

					var items = data._items;
					var clubs = items.map(function (club) {
						club.name = club.name.replace(' Fallskjermklubb', '')
						return {id: club.id, title: club.name };
					});

					def.resolve(clubs);
				});
				return def;
			};

			this.getTypes = function(){

				var objs = Definitions.getObservationTypeMap();
				var arr = [];
				Object.keys(objs).forEach(function (key) {
					var value = objs[key];
					arr.push({id:key,title:value});
				});
				arr.unshift({title: ''});
				return arr;
			};

			this.getWorkflowStates = function(){
				var objs =  Definitions.getObservationWorkflowStates();
				var arr = [];
				Object.keys(objs).forEach(function (key) {
					var value = objs[key];
					arr.push({id:key,title:value});
				});
				arr.unshift({title: ''});
				return arr;
			};

			this.getRatings = function(){
				var arr = [];
				arr.push({id:1,title:'>1'});
				arr.push({id:3,title:'>3'});
				arr.push({id:5,title:'>5'});
				arr.push({id:7,title:'>7'});
				arr.push({id:9,title:'>9'});
				arr.unshift({title: ''});
				return arr;
			};


			this.sortStringFromParams = function(params){
					var sortString = "-id";
					angular.forEach(params.sorting(), function (v, k) {
						if (v == 'desc') {
							sortString = '-' + k;
						}
						if (v == 'asc') {
							sortString = k;
						}

					});
					return sortString;
			};

			this.whereStringFromParams = function(params){

				var filter = params.filter();

				var whereObj = {};
				if(filter['club']){
					whereObj['club'] = filter['club'];
				}

				if(filter['state']){
					whereObj['workflow.state'] = filter['state'];
				}

				if(filter['type']){
					whereObj['type']=filter['type'];

				}

				if(filter['rating']){
					var rating = filter['rating'];
					var actualObj = {};
					actualObj['rating.actual'] = {$gt:rating};
					var potentialObj = {};
					potentialObj['rating.potential'] = {$gt:rating};
					whereObj['$or'] = [actualObj,potentialObj];
				}

				if(filter['tags']){
					whereObj['tags']=filter['tags'];
				}

				return "where="+JSON.stringify(whereObj);
			};


		});
})();