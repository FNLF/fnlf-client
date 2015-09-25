(function () {

	angular.module('reportingApp')
		.service('SearchService', function (RestService, Definitions, Functions,$location) {


			var mapping = {};
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


			this.getObservationParams = function () {
				return Object.keys(mapping);
			};

			var getObservationParamsFn = this.getObservationParams;

			this.getObservationTagGroups = function () {
				var arr = [];
				Object.keys(mapping).forEach(function (k) {
					var v = mapping[k];
					arr = arr.concat(v);
				});
				return arr;
			};

			var whatParams = ['components.tags', 'components.what'];

			this.getWhatTagGroups = function () {
				var groups = [];
				whatParams.forEach(function (k) {
					groups = groups.concat(mapping[k]);
				});
				return groups;
			};

			var gearParams = ['involved.gear.mainCanopyType', 'involved.gear.reserveCanopyType', 'involved.gear.harnessType', 'involved.gear.aadType', 'involved.gear.other'];

			this.getGearTagGroups = function () {
				var groups = [];
				gearParams.forEach(function (k) {
					groups = groups.concat(mapping[k]);
				});
				return groups;
			};

			var atParams = ['components.where.at', 'involved.jumptypeTags', 'involved.aircraft'];

			this.getAtTagGroups = function () {
				var groups = [];
				atParams.forEach(function (k) {
					groups = groups.concat(mapping[k]);
				});
				return groups;
			};


			this.searchByTag = function (page, maxResults, sort, tags) {

				var params = getObservationParamsFn();
				var whereObj = {};

				var andArr = [];

				angular.forEach(tags, function (tag) {
					var orArr = [];
					angular.forEach(params, function (p) {
						var obj = {};
						obj[p] = tag;
						orArr.push(obj);

					});
					andArr.push({$or: orArr});

				});
				whereObj.$and = andArr;
				if (!tags) {
					whereObj = {};
				}
				var whereString = JSON.stringify(whereObj);


				return RestService.getAllObservations(page, maxResults, sort, 'where=' + whereString);
			};

			this.searchByFlag = function (page, maxResults, sort, flag) {
				var attrs = {};
				attrs['components.attributes.' + flag] = true;
				var where = 'where=' + JSON.stringify(attrs);
				return RestService.getAllObservations(page, maxResults, sort, where);
			};


			this.goSearchAdvanced = function(model){

				var text = '';
				['what','gear','at','jumps'].forEach(function(category){
					if (model[category]) {
						console.log(category);
						text += category+'=' + model[category].join(',') + ';';
					}
				});

				if (text) {
					var path = '/search/advanced/' + text;
					console.log(path);
					$location.path(path);
				}

			};

			this.searchAdvanced = function (page, maxResults, sort, queryObj) {

				var getBigOrArray = function (params, tags) {
					var outerOrArray = [];
					angular.forEach(params, function (p) {
						var obj = {};
						obj[p] = {$in: tags};
						outerOrArray.push(obj);
					});

					return outerOrArray;
				};

				var whereObj = {};
				var andArr = [];
				whereObj.$and = andArr;

				var queryParams = {what: whatParams,gear:gearParams,at:atParams};

				['what','gear','at'].forEach(function(category){
					if (queryObj[category].length > 0) {
						andArr.push({$or: getBigOrArray(queryParams[category], queryObj[category])});
					}
				});


				if(queryObj.jumps&&queryObj.jumps.length==2){
					var lessThanJumps = queryObj.jumps.length[0];
					var greaterThanJumps = queryObj.jumps.length[1];
					if(lessThanJumps) {
						var obj = {};
						obj['involved.numberOfJumps'] = {$lte:lessThanJumps};
						andArr.push(obj);
					}

					if(greaterThanJumps) {
						var obj = {};
						obj['involved.numberOfJumps'] = {$gte:greaterThanJumps}
						andArr.push(obj);
					}
				}

				if (!(queryObj.what&&queryObj.gear&&queryObj.at&&queryObj.jumps)) {
					whereObj = {};
				}

				var where = 'where=' + JSON.stringify(whereObj);
				return RestService.getAllObservations(page, maxResults, sort, where);

			};


			this.parseAdvancedSearchQuery = function (query) {
				var queryObj = {what:[],gear:[],at:[],jumps:[0,0]};
				if(!query){
					return queryObj;
				}

				var queryParts = query.split(';');
				queryParts.forEach(function (part) {
					var keyValueArr = part.split('=');
					if (keyValueArr.length == 2) {
						['what','gear','at','jumps'].forEach(function(category){
							if (keyValueArr[0] == category && keyValueArr[1]) {
								queryObj[category] = keyValueArr[1].split(',')
									.map(function (tag) {
										return Functions.capitalizeFirstLetter(tag)
									});
							}

						});

					}
				});

				return queryObj;

			};



			this.parseTagQuery = function(query){
				query = decodeURIComponent(query);
				var tags = query.split(',')
					.map(function(t){
						return Functions.capitalizeFirstLetter(t)
					});
				return tags;
			};


			this.flattenComponentWhat = function(observation){
				if(angular.isUndefined(observation.components)){
					return [];
				}

				return observation.components.map(function(c){
					return Functions.capitalizeFirstLetter(c.what);
				});
			};

			this.flattenComponentTags = function(observation){
				if(angular.isUndefined(observation.components)){
					return [];
				}

				var tags = [];
				angular.forEach(observation.components, function(c){
					angular.forEach(c.tags,function(t){
						tags.push(Functions.capitalizeFirstLetter(t));
					});
				});

				return tags;
			};


			this.flattenAttributes = function(observation){
				if(angular.isUndefined(observation.components)){
					return [];
				}

				var attributes = {};
				angular.forEach(observation.components, function(c){
					angular.forEach(c.attributes,function(v,k){
						if(v){
							attributes[k]=v;
						}

					});
				});
				return attributes;
			};

		});


})();
