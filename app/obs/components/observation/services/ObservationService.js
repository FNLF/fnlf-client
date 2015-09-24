(function () {

	angular.module('reportingApp')
		.service('ObservationService', function (RestService,Definitions,Functions,$rootScope,$location,$q) {

			function Observation() {
				this.involved = [];
				this.when = new Date();
				this.location={};
				this.organization={};
				this.organization.hl=[];
				this.organization.hm=[];
				this.organization.hfl=[];
				this.rating = {};
				this.weather = {};
				this.components = [];
				this.files=[];
				this.related = [];
				this.tags = [];
				this.comments = [];
				this.actions = {};
				this.type = 'near_miss';
			};

			
			this.initObservation = function(observation){

				var prototypeObs = new Observation();

				for(var k in prototypeObs){
					if(angular.isUndefined(observation[k])){
						observation[k]=prototypeObs[k];
					}
				}
				
			};

			var initObservationFn = this.initObservation;

			var observation = new Observation();

			this.setObservation = function (selectedObservation) {
				observation = selectedObservation;
			};
			this.getObservation = function () {
				return observation;
			};




			this.getObservationById = function (id) {
				return RestService.getObservationById(id)
					.then(function(obs){
						initObservationFn(obs);
						return obs;
					});
			};


			this.createObservation = function () {



			};

			this.editObservation = function (_id) {
				RestService.getObservation(_id).then(function (item) {
					if (item.workflow.state == 'closed') {
						$location.path("/observation/report/" + item.id);
					}
					else {
						$location.path("/observation/" + item.id);
					}
				});

			};





			var clearFullname = function(person){
				if(person) {
					delete person.open;
					delete person.fullname;
				}
			};

			function clearFullnameFromObservation(observation){
				angular.forEach(observation.involved,clearFullname);

				angular.forEach(observation.involved,function(p){
					if(p){
						if(p.gear){
							if(p.gear.rigger){
								clearFullname(p.gear.rigger);
							}
						}
					}



				});

				angular.forEach(observation.organization.hl,clearFullname);
				angular.forEach(observation.organization.hm,clearFullname);
				angular.forEach(observation.organization.hfl,clearFullname);
				angular.forEach(observation.organization.pilot,clearFullname);
				angular.forEach(observation.components,function(comp){
				angular.forEach(comp.involved,clearFullname);
				});


			};


			var populateUserObject = function(involved){
				var userObj = {};
				userObj.id=involved.id;
				userObj.settings={};
				if(involved.numberOfJumps) {
					userObj.settings.total_jumps = involved.numberOfJumps;
				}
				if(involved.gear){
					userObj.settings.gear = involved.gear;
				}
				return userObj;
			};


			var updateUserData = function(involved){
				if(involved.id >0 ) {
					RestService.getUser(involved.id)
						.then(function (user) {
							var userObj = populateUserObject(involved);
							var _id = user._id;
							var _etag = user._etag;
							RestService.updateUserData(_id,_etag,userObj);
						})
						.catch(function(){
							//Not possible. Can't create user.
							//var userObj = populateUserObject(involved);
							//RestService.createUser(involved.id,userObj);
						});
				}
			};

			this.updateObservation = function (observation) {

				clearFullnameFromObservation(observation);


				angular.forEach(observation.involved,function(p){
					updateUserData(p);
				});


				var _id = observation._id;
				var id = observation.id;
				var _etag = observation._etag;

				var observationDto = {};
				Functions.copy(observation,observationDto);

				delete observationDto.id;
				delete observationDto.reporter;
				delete observationDto.owner;
				delete observationDto.wilfull;

				delete observationDto.title;
				delete observationDto._updated;
				delete observationDto._latest_version;
				delete observationDto.audit;
				delete observationDto.watchers;
				delete observationDto._version;
				delete observationDto.workflow;
				delete observationDto._links;
				delete observationDto._created;
				delete observationDto._status;
				delete observationDto._etag;
				delete observationDto._id;



				$rootScope.error = null;

				return RestService.updateObservation(observationDto, _id, _etag)
					.then(function(obs){
						return RestService.getObservation(id)
							.then(function(updated){
								clearFullnameFromObservation(updated);
								return updated;
							});
					});
			};

			this.clearObservation = function () {
				observation = new Observation();
			};

			/**
			 * Change workflow state if access
			 * 
			 * 
			 */
			this.changeWorkflowState = function (objectId, action, comment,callback){
				
				RestService.changeWorkflowState(objectId, action, comment)
				.then(function(data){
					RestService.getObservation(objectId)
						.then(function(updated){
							callback(updated);

						});
				},function(error){
						console.log(error);
						$rootScope.error=error;
						RestService.getObservation(objectId)
							.then(function(updated){
								callback(updated);

							});
					});
			};
			
			/**
			 * Watching start/stop
			 */
			
			this.isWatching = function(objectId) {
				
				
			};
			
			this.stopWatching = function(objectId) {
				
			};

			var mapping = {};
			mapping['tags'] = ['observation'];
			mapping['components.tags'] = ['component'];
			mapping['components.what'] = ['component.what.cause','component.what.consequence','component.what.incident'];
			mapping['components.where.at'] = ['where-at'];
			mapping['involved.jumptypeTags'] = ['jumptypes'];
			mapping['involved.aircraft'] = ['aircraftTypes'];
			mapping['involved.gear.mainCanopyType'] = ['maincanopies'];
			mapping['involved.gear.reserveCanopyType'] = ['reserveCanopies'];
			mapping['involved.gear.harnessType'] = ['harnessTypes'];
			mapping['involved.gear.aadType'] = ['aadType'];
			mapping['involved.gear.other'] = ['otherEquipment'];



			this.getObservationParams = function(){
				return Object.keys(mapping);
			};

			var getObservationParamsFn = this.getObservationParams;

			this.getObservationTagGroups = function(){
				var arr = [];
				Object.keys(mapping).forEach(function(k){
					var v = mapping[k];
					arr = arr.concat(v);
				});
				return arr;
			};

			var whatParams = ['components.tags','components.what'];

			this.getWhatTagGroups = function(){
				var groups = [];
				whatParams.forEach(function(k){
					groups = groups.concat(mapping[k]);
				});
				return groups;
			};

			var gearParams = ['involved.gear.mainCanopyType','involved.gear.reserveCanopyType','involved.gear.harnessType','involved.gear.aadType','involved.gear.other'];

			this.getGearTagGroups = function(){
				var groups = [];
				gearParams.forEach(function(k){
					groups = groups.concat(mapping[k]);
				});
				return groups;
			};

			var atParams = ['components.where.at','involved.jumptypeTags','involved.aircraft'];

			this.getAtTagGroups = function(){
				var groups = [];
				atParams.forEach(function(k){
					groups = groups.concat(mapping[k]);
				});
				return groups;
			};



			this.searchByTag = function(page,maxResults,sort,tags){

				var params = getObservationParamsFn();
				var whereObj = {};

				var andArr = [];

				angular.forEach(tags,function(tag){
					var orArr = [];
					angular.forEach(params,function(p){
						var obj = {};
						obj[p] = tag;
						orArr.push(obj);

					});
					andArr.push({$or:orArr});

				});
				whereObj.$and = andArr;
				if(!tags){
					whereObj = {};
				}
				var whereString = JSON.stringify(whereObj);



				return RestService.getAllObservations(page,maxResults,sort,'where='+whereString);
			};

			this.searchByFlag = function(page,maxResults,sort,flag){
				var attrs = {};
				attrs['components.attributes.'+flag]=true;
				var where = 'where='+JSON.stringify(attrs);
				return RestService.getAllObservations(page,maxResults,sort,where);
			};


			var getBigOrArray = function(params,tags){
				var outerOrArray = [];
				angular.forEach(params,function(p){
							var obj = {};
							obj[p] = {$in:tags};
							outerOrArray.push(obj);
						});

				return outerOrArray;
			};

            this.searchAdvanced = function(page,maxResults,sort,queryObj){


                var whereObj = {};
               	var andArr = [];
               	whereObj.$and=andArr;

				if(queryObj.gear.length>0){
					andArr.push({$or:getBigOrArray(gearParams,queryObj.gear)});
				}

				if(queryObj.what.length>0){
					andArr.push({$or:getBigOrArray(whatParams,queryObj.what)});
				}

				if(queryObj.at.length>0){
					andArr.push({$or:getBigOrArray(atParams,queryObj.at)});
				}

                var where = 'where='+JSON.stringify(whereObj);

				return RestService.getAllObservations(page,maxResults,sort,where);

            };



            this.queryToQueryObj = function(query){

                var queryObj = {};
                queryObj.what=[];
                queryObj.gear=[];
                queryObj.at=[];
                var queryParts=query.split(';');
                queryParts.forEach(function(p){
                    var split = p.split('=');
                    if(split.length==2){


                        if(split[0]=='what' && split[1]){
                        	queryObj.what = split[1].split(',')
                        		.map(function(t){return Functions.capitalizeFirstLetter(t)});
                        }
                        if(split[0]=='gear' && split[1]){
                            queryObj.gear = split[1].split(',')
                            	.map(function(t){return Functions.capitalizeFirstLetter(t)});
                        }
                        if(split[0]=='at' && split[1]){
                            queryObj.at = split[1].split(',')
                            	.map(function(t){return Functions.capitalizeFirstLetter(t)});
                        }
                    }
                });

            return queryObj;

            };



		});


})();
