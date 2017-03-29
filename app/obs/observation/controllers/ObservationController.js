(function () {

	angular.module('reportingApp')
		.controller('ObservationController',
		function ($scope, Upload, $rootScope, ObservationService,Definitions,LocationService,
				  $routeParams, $timeout, $http, $window, $location, DoNotReloadCurrentTemplate,
				  $rootScope, Functions, Appswitcher, Idle, Keepalive, Title) {

			//This is aside back button hack
			DoNotReloadCurrentTemplate($scope);
			
			$rootScope.nav = {toolbar: [], menus: [], brand: []}; //reset
			$rootScope.nav.brand = 'FNLF ORS #' + $routeParams.id;

			var observationId = $routeParams.id;
			$scope.observation = {id:observationId};
			$scope.observationChanges = false;

			$scope.ui=$routeParams.ui;
			$scope.fullscreen=$scope.ui;



			$rootScope.setFullscreen = function(fullscreenName){

				$location.search('ui',fullscreenName);
			};

			/**
			* Listeners
			**/
			$rootScope.$on('$routeChangeStart', function (event, next, current) {
				if(!$location.search().ui){
					$scope.fullscreen='';
				}else{
					$scope.fullscreen = $location.search().ui;
				}


				if($scope.fullscreen){
					$rootScope.navBarHidden=true;
				}else{
					$rootScope.navBarHidden=false;
				}
			});

			$rootScope.$on("fullscreen-closed", function(event, data) {
				$scope.saveObservation();

			});

			/**
			* Autosave via ng-idle
			* Available {{minutes}} and {{seconds}} for title
			*/
			$scope.$on('IdleStart', function() {
				$scope.autosave = false;
				Title.idleMessage("Autosave in {{seconds}}s");
				Title.timedOutMessage("Autosaving...");
      		});

      		$scope.$on('IdleEnd', function() {
        		$scope.autosave = false;
      		});

      		$scope.$on('IdleTimeout', function() {

				if($scope.acl.w) {
					$scope.autosave = true;
					$rootScope.saveObservation();
					$scope.autosave = false;
				};
      		});
			
			/**
			* Get acl for observation
			**/
			$scope.getAcl = function(){
				ObservationService.getAcl(observationId)
					.then(function(acl){
						$scope.acl=acl;
					});
			};
			
			$rootScope.saveDisabledFn = function(){
				return !$scope.observationChanges;
			};

			$rootScope.observationIsChanged = function(){
				return $scope.observationChanges;
			};

			$rootScope.openInReport = function(){
				$location.path('/observation/report/'+ $scope.observation.id);
			};
			$rootScope.openInReportdisabledFn = function(){
				return $scope.observationChanges;
			};


			/**
			* Menu and toolbar setup
			**/
			Appswitcher.getApps();
			$rootScope.title = 'F/NLF - ORS editor #' + $scope.observation.id;

			var addMenusAndToolbar = function(){
				$rootScope.nav.brand = 'FNLF ORS #' + $scope.observation.id;
				//$rootScope.nav.menus = [{title: 'Åpne i rapport', icon: 'fa-file-text-o', link: '#!/observation/report/'+ $scope.observation.id}];
				if($scope.observation.workflow.state != 'closed' && $scope.observation.workflow.state !='withdrawn') {
					$rootScope.nav.toolbar[0] = {disabled:$rootScope.saveDisabledFn,
												 text: 'Lagre',
												 btn_class: 'primary',
												 icon: 'save',
												 id: 'ors_save_btn',
												 onclick: $rootScope.saveObservation};
				}
				
				$rootScope.nav.toolbar[2] = {disabled:$rootScope.openInReportdisabledFn,
											 text: 'Åpne i rapport',
											 btn_class: 'default',
											 icon: 'file-text-o',
											 onclick: $rootScope.openInReport};
			};

			var disableOpenInReportLink = function(){
			};


			/**
			* Load observation
			**/
			$scope.loadObservation = function(){
				$scope.observation = {};
				ObservationService.getObservationById(observationId)
					.then(function(obs){
						$scope.getAcl();
						$scope.observation = obs;
						$scope.getClubLocations();
						$scope.observationChanges = false;
						$timeout(function(){
							$scope.observationChanges = false;
						},10);

						addMenusAndToolbar();
				}).catch(function(error){
						console.log("Catched in ObservationController: "+error);
						$rootScope.error = "Enten så mangler du tilgang til observasjonen, eller så eksisterer den ikke";
					});
			};

			/**
			* Save observation
			**/
			$scope.saveObservation = function () {

				if($scope.observationChanges == false || !$scope.acl.w) {

					if(!$scope.acl.w) {
						$rootScope.error = "Du mangler skrivetilgang til #"+$scope.observation.id+". Kunne ikke lagre.";
					}

					return false;
				}

				ObservationService.updateObservation($scope.observation)
					.then(function(updated){
						$rootScope.error = '';
						$scope.observation = updated;
						$scope.getAcl();

					})
					.then(function(){
							$timeout(function(){
								$scope.observationChanges = false;
								$window.onbeforeunload = null;
								addMenusAndToolbar();
								Idle.unwatch(); //Unwatch when no changes
							},0);
						})
					.catch(function(error){

						if(error.indexOf("PRECONDITION FAILED")>-1){
								var yourVersion = $scope.observation._latest_version;
								var yourUpdated = $scope.observation._updated;
								ObservationService.getObservationById(observationId)
									.then(function(r){
										var theirVersion = r._latest_version;
										var theirUpdated = r._updated;
										$rootScope.error = 'Kunne ikke lagre fordi versjonen på serveren, versjon '+theirVersion+' (oppdatert '+theirUpdated+') , er nyere enn din versjon '+yourVersion+'';

									});


						}else if(error.indexOf("The requested URL was not found on the server.")>-1){
							$rootScope.error = "Du mangler skrivetilgang til #"+$scope.observation.id+". Kunne ikke lagre.";
						} else{
							console.log("Catch error in ObservationController. Reloading observation"+error);
							$rootScope.error = error;
						}


						$scope.loadObservation();
					});
			};

			/** Always load the observation **/
			$scope.loadObservation();

			/**
			* Load and save on rootScope
			**/
			$rootScope.loadObservation = function() {
				$scope.loadObservation();
			};
			
			$rootScope.saveObservation = function() {
				$scope.saveObservation();
			};
			
			/**
			* Init observation types
			**/
			var observationTypes = Definitions.getObservationTypes();

			$scope.observationTypesArray = {};

			observationTypes.forEach(function(t){
				$scope.observationTypesArray[t.id] = t.name;
			});



			/**
			* Diff function
			**/
			var printDiff = function(changedObs,oldObs){
				var diff = Functions.objectDifference(oldObs,changedObs,'observation');
				console.log('observation changed, diff:');
				angular.forEach(diff,function(o){
					console.log(o);
				});
			};

			/**
			 * Triggers saved/unsaved label
			 */
			$scope.observationChanges = false;
			$scope.$watch('observation', function(changedObs,oldObs) {
				if(oldObs._id) {
					if(false) {
						printDiff(changedObs, oldObs);
					}
					if($scope.acl && !$scope.acl.w){
						var msg = 'Du vil ikke kunne lagre fordi du mangler skrivetilgang';
						$rootScope.error = msg;
					}else{
						$window.onbeforeunload = function(){
							return 'You have unsaved observation data';
						};

						$scope.$on('$destroy', function() {
						   $window.onbeforeunload = undefined;
						});
						/*
						$scope.$on('$locationChangeStart', function(event, next, current) {
						   if(!confirm('You have unsaved observation data\nAre you sure you want to leave the page?')) {
							  event.preventDefault();
						   }
						});
						*/
						disableOpenInReportLink();
						$scope.observationChanges = true;
						//Idle watch init
						Idle.watch();
						$scope.autosave = false;
					}
				}
			},true);



			/**
			 * File upload!
			 * Uses ng-file-upload
			 **/

			$scope.upload = function (files) {

				var urlBase = '/api/v1';

				var config = {};

				if (files && files.length) {

					 for (var i = 0; i < files.length; i++) {

						 var file = files[i];
						 var uploads = 0;

						 Upload.upload({
							 url: urlBase + '/files/',
							 fields: {'ref': 'observations',
									  'ref_id': $scope.observation._id,
									  'content_type': file.type,
									  'name': file.name,
									  'size': file.size,
									  'owner': $rootScope.username }, //additional form fields
							 file: file,
							 method: 'POST',
							 fileFormDataName: 'file', //Assign file to field name
							 headers: config.headers //Add etag
							 }).progress(function (evt) {
								 var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
							 }).success(function (data, status, headers, config) {
								 if(data._status == 'OK') {
									 $scope.observation.files.push({'f': data._id, 'r': true});
								 }

							 }).then(function(success, error, progress) {
								//Only save when last upload returns
								uploads++;
								if(files.length == uploads) $scope.saveObservation();
							});
						 }

					 };
			 };

			/**
			* Get locations for club
			**/
			$scope.getClubLocations = function() {

				LocationService.getClubLocations($scope.observation.club).then(function(response) {

					var filteredLocations = response.locations
					.filter(function(l){
						return typeof l =='object'
						&& typeof l.geo !='undefined'
						&& typeof l.geo.coordinates != 'undefined'
						&& typeof l.nickname!='undefined'
						&& l.nickname.length >0;
					});


					$scope.clublocations = filteredLocations;

					if(typeof $scope.observation.location.nickname == 'undefined'){
						if($scope.clublocations.length > 0){
							$scope.observation.location  = filteredLocations[0];
						}else{
							$scope.observation.location = {};
						}
					}



					});
				};



			});




})();