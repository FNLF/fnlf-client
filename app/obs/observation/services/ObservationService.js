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
				this.ask = {skills:0,knowledge:0,attitude:0};
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

				['id','reporter','owner','watchers','workflow'].forEach(function(k){
					delete observationDto[k];
				});

				Object.keys(observationDto).forEach(function(k){
					if(k.indexOf('_')==0){
						delete observationDto[k];
					}

				});

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

			this.getWorkflowState = function (observation_id,observationId) {

				var deferred = $q.defer();

				RestService.getWorkflowState(observation_id)
					.then(function (response) {

						var workflowState = {};


						var icon = '';
						var btns = [];
						var btnss = '';
						var btn_class = 'default';

						for (var k in response.actions) {
							var side = 'left';

							if (response.actions[k].resource == 'approve') {
								btn_class = 'success';
								icon = 'check';
							}

							else if (response.actions[k].resource == 'withdraw') {
								btn_class = 'warning';
								side = 'right';
								icon = 'ban';
							}
							else if (response.actions[k].resource == 'reopen') {
								btn_class = 'primary';
								side = 'left';
								icon = 'reply';
							}
							else if (response.actions[k].resource == 'reject') {
								btn_class = 'danger';
								side = 'right';
								icon = 'close';
							}
							else btn_class = 'default';

							btnss += '<button class="pull-' + side + ' btn btn-' + btn_class + '" ng-click="changeWorkflowState("' + response.actions[k].resource + '","Kommentaren") ">' + response.actions[k].action + '</button>';

							btns.push({
								permission: response.actions[k].permission,
								action: response.actions[k].action,
								title: response.actions[k].title,
								resource: response.actions[k].resource,
								side: side,
								btn_class: btn_class,
								icon: icon
							});

							workflowState.workflowpermission = response.actions[k].permission;
						}
						;


						workflowState.tt = 'default';
						if (['pending_review_hi', 'pending_review_fs', 'pending_review_su'].indexOf(response.state) > -1) {
							workflowState.tt = 'warning';
						} else if (response.state == 'ready') {
							workflowState.tt = 'primary';
						} else if (response.state == 'closed') {
							workflowState.tt = 'success';
						} else if (response.state == 'withdrawn') {
							workflowState.tt = 'danger';
						} else if (response.state == 'draft') {
							workflowState.tt = 'info';
						}

						workflowState.tooltip = response.description;

						workflowState.wf = {btns: '', title: '', comment: ''};

						workflowState.btn_title = response.title;

						if (!workflowState.workflowpermission) {
							workflowState.btn_descr = 'Du har ikke tilgang til arbeidsflyten';
						}else{
							workflowState.btn_descr = response.description;
						}

						workflowState.btns = btns;
						workflowState.username = +$rootScope.username;
						workflowState.title = 'Arbeidsflyt for #' + observationId;

						var disabledFn = function () {
							if (!workflowState.workflowpermission || $rootScope.observationIsChanged()){
								return true;
							}

							return false;
						};
						var toolbarbutton = {
							disabled: disabledFn,
							tooltip: response.description,
							text: response.title,
							btn_class: workflowState.tt,
							icon: 'random'
						};
						workflowState.toolbarbutton = toolbarbutton;

						deferred.resolve(workflowState);
					})
					.catch(function(error){
						deferred.reject(error);
					});

				return deferred.promise;
			};


			/**
			 * Watching start/stop
			 */
			
			this.isWatching = function(objectId) {
				
				
			};
			
			this.stopWatching = function(objectId) {
				
			};

			this.getAcl = function(id){
				return RestService.getObservationAcl(id);
			};




		});


})();
