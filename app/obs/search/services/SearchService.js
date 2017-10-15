(function () {

	angular.module('reportingApp')
		.service('SearchService', function (RestService, Definitions, Functions,$location) {

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

				var andArr = addAllParamsForAllTagsFn(tags);

				addComponentAttributePartsFn(filter,andArr);

				var date1 = (filter['year1'] ? new Date(Date.UTC(filter['year1'], 0, 0, 0, 0)):null);
				var date2 = (filter['year2'] ? new Date(Date.UTC(filter['year2'], 12, 30, 0, 0)):null);
				addNumberFilterFn('when',date1,date2,andArr);
				addNumberFilterFn('involved.numberOfJumps',filter['jumps1'],filter['jumps2'],andArr);
				addNumberFilterFn('involved.yearsOfExperience',filter['years1'],filter['years2'],andArr);
				addNumberFilterFn('involved.gear.mainCanopySize',filter['mainsize1'],filter['mainsize2'],andArr);
				addNumberFilterFn('involved.gear.mainCanopyExperience',filter['mainExperience1'],filter['mainExperience2'],andArr);
				addNumberFilterFn('involved.gear.harnessExperience',filter['harnessExperience1'],filter['harnessExperience2'],andArr);
				addSimpleAttrFilterFn(filter,'jumptypeSelected','involved.jumptypeSelected',andArr);
				addSimpleAttrFilterFn(filter,'club','club',andArr);
				addSimpleAttrFilterFn(filter,'type','type',andArr);

				addBoolAttrFilterFn(filter,'fu','involved.verdict.fu',andArr);
				addBoolAttrFilterFn(filter,'ph','involved.verdict.ph',andArr);
				addBoolAttrFilterFn(filter,'aviation','flags.aviation',andArr);
				addBoolAttrFilterFn(filter,'insurance','flags.insurance',andArr);


				var whereObj = {};

				//Search by id
				var idArr = extractIdArrayFn(tags);

				if(idArr.length==0){					
					if(andArr.length>0){
						whereObj.$and = andArr;
					}					
				}else{
					whereObj.$or=idArr;
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


			var addAllParamsForAllTagsFn = function(tags){

				var params = getObservationParamsFn();
			

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

				return andArr;
			};

			var addComponentAttributePartsFn = function(filter,andArr){
					var allAttributes  = Definitions.getComponentAttributes();
					allAttributes.forEach(function(a){
						if(filter[a.attribute]){
							var atr = {};
							atr['components.attributes.' + a.attribute] = true;
							andArr.push(atr);
						}
					});
			};

			var addNumberFilterFn = function(dbField,filterField1,filterField2,andArr){
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

			var addSimpleAttrFilterFn = function(filter,filterParam,modelParam,andArr){
				if(filter[filterParam]){
					var atr = {};
										atr[modelParam] = filter[filterParam];
										andArr.push(atr);
				}
			};

			var addBoolAttrFilterFn = function(filter,filterParam,modelParam,andArr){
				if(filter[filterParam]){
					var atr = {};
					atr[modelParam] = true;
					andArr.push(atr);
				}
			};

			var extractIdArrayFn = function(tags){
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
				return idArr;
			};


		});


})();
