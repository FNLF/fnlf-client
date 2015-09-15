(function () {

	angular.module('reportingApp')
		.service('ObservationsTableService', function (ngTableParams,RestService,$q,Definitions) {

			this.getTags = function () {
				var def = $q.defer();
				RestService.getTags('observation').then(function(data){
						var items = data._items;
						var tags = items.map(function (tag) {
							return {id: tag.tag, title: tag.tag+' ('+tag.freq+')'};
						});
						tags.unshift({title: ''});
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
						return {id: club.id, title: club.name};
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

			this.whereStringFromParams = function(params){
				var whereString = 'where={';
				var filter = params.filter();


				if(filter['club']){
					whereString += '"club":"'+filter['club']+'",';
				}

				if(filter['state']){
					whereString += '"workflow.state":"'+filter['state']+'",';
				}

				if(filter['type']){
					whereString += '"type":"'+filter['type']+'",';
				}

				if(filter['rating']){
					var rating = filter['rating'];
					whereString += '"$or":[ {"rating.actual":{"$gt":'+rating+'}}, {"rating.potential":{"$gt":'+rating+'}}],';
				}

				if(filter['tags']){
					var tag = filter['tags'];
					whereString += '"tags":"'+tag+'",';
				}

				whereString = whereString.replace(/,\s*$/, "");
				whereString = whereString +'}';

				return whereString;
			};


		});
})();