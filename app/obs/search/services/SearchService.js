(function () {

	angular.module('reportingApp')
		.service('SearchService', function (RestService, Definitions, Functions,$location) {


			var mapping = Definitions.tagsMapping(); //mapping from db-model param name to list of tag group names

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

			this.go = function (text,filter) {
			
				var filterString = '';

				var filteredFilter = {};
				if(filter) {
					Object.keys(filter).forEach(function (k) {
						if (filter[k]) {
							filteredFilter[k] = filter[k];
						}
					});
				}
				if(Object.keys(filteredFilter).length>0){
					filterString=','+JSON.stringify(filteredFilter);
				}

				var path = '/search/tag/' + Functions.capitalizeFirstLetter(text)+filterString;
				$location.path(path);
			};


			this.search = function (page, maxResults, sort, tags,filter) {

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

				var addSimpleAttrFilterFn = function(filter,filterParam,modelParam){
					if(filter[filterParam]){
						var atr = {};
                    	atr[modelParam] = filter[filterParam];
                    	andArr.push(atr);
					}
				};

				var addBoolAttrFilterFn = function(filter,filterParam,modelParam){
					if(filter[filterParam]){
						var atr = {};
						atr[modelParam] = true;
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

				addBoolAttrFilterFn(filter,'fu','involved.verdict.fu');
				addBoolAttrFilterFn(filter,'ph','involved.verdict.ph');
				addBoolAttrFilterFn(filter,'aviation','flags.aviation');
				addBoolAttrFilterFn(filter,'insurance','flags.insurance');


				//Search by id
				var idArr = [];
				angular.forEach(tags, function (tag) {
					var isInt = /^\+?\d+$/.test(tag);
					if(isInt){
                		var id = parseInt(tag,10);
                		var obj = {};
                		obj.id=id;
                		idArr.push(obj);
                	}
				});
				if(idArr.length>0){
					whereObj.$or=idArr;
				}else{
					if(andArr.length>0) {
						whereObj.$and = andArr;
					}
				}

				var whereString = JSON.stringify(whereObj);

				console.log(whereString);

				return RestService.getAllObservations(page, maxResults, sort, 'where=' + whereString);
			};

			this.searchByFlag = function (page, maxResults, sort, flag) {
				var attrs = {};
				attrs['components.attributes.' + flag] = true;
				var where = 'where=' + JSON.stringify(attrs);
				return RestService.getAllObservations(page, maxResults, sort, where);
			};

			this.searchRaw = function (page, maxResults, sort, rawquery) {
				var where = 'where=' + rawquery;
				console.log("Raw search "+where);
				return RestService.getAllObservations(page, maxResults, sort, where);
			};



			this.parseTagQuery = function(query){
				query = decodeURIComponent(query);
				query = query.replace(/\{.*\}/g,'');
				query = query.replace(/(^,)|(,$)/g, "");
				var tags = query.split(',')
					.map(function(t){
						t = t.replace('#',''); // # makes the server return error
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
