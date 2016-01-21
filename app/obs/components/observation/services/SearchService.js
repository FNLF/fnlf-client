(function () {

	angular.module('reportingApp')
		.service('SearchService', function (RestService, Definitions, Functions,$location) {


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


			this.searchByTag = function (page, maxResults, sort, tags,filter) {

				var params = getObservationParamsFn();
				var whereObj = {};

				var andArr = [];

				angular.forEach(tags, function (tag) {
					if(tag) {
						var orArr = [];
						angular.forEach(params, function (p) {
							var obj = {};
							obj[p] = tag;
							orArr.push(obj);

						});
						if (orArr) {
							andArr.push({$or: orArr});
						}
					}
				});


				var allAttributes  = Definitions.getComponentAttributes();
				allAttributes.forEach(function(a){
					if(filter[a.attribute]){
						var atr = {};
						atr['components.attributes.' + a.attribute] = true;
						andArr.push(atr);
					}
				});


				var addNumberFilterFn = function(dbField,filterField1,filterField2){
					if(filterField1){
						var obj = {};
						obj[dbField]={$gte:filterField1};
						andArr.push(obj);
					}

					if(filterField2){
						var obj = {};
						obj[dbField]={$lte:filterField2};
						andArr.push(obj);
					}
				};

				var addSimpleAttrFilterFn = function(filter,modelParam,filterParam){
					if(filter[filterParam]){
						var atr = {};
                    	atr[modelParam] = filter[filterParam];
                    	andArr.push(atr);
					}
				};

				var date1 = (filter['year1'] ? new Date(Date.UTC(filter['year1'], 0, 0, 0, 0)):null);
				var date2 = (filter['year2'] ? new Date(Date.UTC(filter['year2'], 12, 30, 0, 0)):null);
				addNumberFilterFn('when',date1,date2);
				addNumberFilterFn('involved.numberOfJumps',filter['jumps1'],filter['jumps2']);
				addNumberFilterFn('involved.yearsOfExperience',filter['years1'],filter['years2']);
				addNumberFilterFn('involved.gear.mainCanopySize',filter['mainsize1'],filter['mainsize2']);
				addNumberFilterFn('involved.gear.mainCanopyExperience',filter['mainExperience1'],filter['mainExperience2']);
				addNumberFilterFn('involved.gear.harnessExperience',filter['harnessExperience1'],filter['harnessExperience2']);
				addSimpleAttrFilterFn(filter,'jumptypeSelected','involved.jumptypeSelected');
				addSimpleAttrFilterFn(filter,'club','club');
				addSimpleAttrFilterFn(filter,'type','type');

				if(andArr.length>0) {
					whereObj.$and = andArr;
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

						text += category+'=' + model[category].join(',') + ';';
					}
				});

				if (text) {
					var path = '/search/advanced/' + text;

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
				query = query.replace(/\{.*\}/g,'');
				query = query.replace(/(^,)|(,$)/g, "");
				var tags = query.split(',')
					.map(function(t){
						return Functions.capitalizeFirstLetter(t.trim());
					});
				return tags;
			};

			this.parseFilter = function(query){
				var filter = {};
				query = decodeURIComponent(query);
				var match = query.match(/\{.*\}/g);
				if(match){
					try {
						return JSON.parse(match[0]);
					}catch(e){
						console.log(e);
						console.log(query);
						console.log(match[0])
					}
				}

				return filter;
			};



		});


})();
