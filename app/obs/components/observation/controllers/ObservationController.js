(function () {

	/**
	 *
	 * @author: Tore Buer, s180346
	 * @author: Eivind Jacobsen, s173466
	 * @author: Morten Kristoffersen, s169440
	 *
	 * @since may.26.2014
	 *
	 */
	angular.module('reportingApp')
		.controller('ObservationController', function ($scope, ObservationService,Definitions,$routeParams,$timeout, $upload, $http, $window, DoNotReloadCurrentTemplate, $rootScope,Functions) {
			
			//This is aside back button hack
			DoNotReloadCurrentTemplate($scope);
			
			$rootScope.nav = {toolbar: [], menus: [], brand: []}; //reset
			$rootScope.nav.brand = "FNLF Observasjonsregistrering";
			
			var observationId = $routeParams.id;
			$scope.observation = {id:observationId};
			$scope.observationChanges = false;

			$scope.ui=$routeParams.ui;

			var addMenusAndToolbar = function(){
				$rootScope.nav.brand = 'FNLF Observasjon #' + $scope.observation.id;
				$rootScope.nav.menus = [{title: 'Åpne i rapport', icon: 'fa-file-text-o', link: '#!/observation/report/'+ $scope.observation.id}];
				if($scope.observation.workflow.state != 'closed' && $scope.observation.workflow.state !='withdrawn') {
					$rootScope.nav.toolbar[0] = {disabled:$rootScope.disabledFn,tooltip:'Lagre observasjon',text:'Lagre',btn_class:'primary',icon:'save',onclick:$rootScope.saveObservation};
				}
			};

			var disableOpenInReportLink = function(){
				$rootScope.nav.menus = [{title: 'Åpne i rapport', icon: 'fa-file-text-o', link: ''}];
			};

			$scope.loadObservation = function(){
				$scope.observation = {};
				ObservationService.getObservationById(observationId)
					.then(function(obs){
						$scope.observation = obs;

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
			$scope.loadObservation();
			
			$rootScope.loadObservation = function() {
				$scope.loadObservation();
			};
			
			$rootScope.saveObservation = function() {
				$scope.saveObservation();
			};
			
			//Toolbar!
			var disabledFn = function(){
				return !$scope.observationChanges;
			 };
			
			
			var observationTypes = Definitions.getObservationTypes();

			$scope.observationTypesArray = {};

			observationTypes.forEach(function(t){
				$scope.observationTypesArray[t.id] = t.name;
			});


		$rootScope.saveObservation = function () {


			ObservationService.updateObservation($scope.observation)
				.then(function(updated){
					$rootScope.error = '';
					$scope.observation = updated;


				})
				.then(function(){
						$timeout(function(){
							$scope.observationChanges = false;
							$window.onbeforeunload = null;
							addMenusAndToolbar();
						},100);
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


		
		/**
		 * Triggers saved/unsaved label
		 */
		$scope.observationChanges = false;
		$scope.$watch('observation', function(changedObs,oldObs) {
			if(oldObs._id) {

				//var diff = Functions.objectDifference(oldObs,changedObs,'observation');
				//console.log('observation changed, diff:');
				//angular.forEach(diff,function(o){
				//	console.log(o);
				//});


				$window.onbeforeunload = function(){
			        return 'You have unsaved observation data';
			      };
				disableOpenInReportLink();
				$scope.observationChanges = true;
			}
		},true);

		/******************************************************
		 * File upload!
		 *****************************************************/
		//Watch changes on files
//		$scope.$watch('files', function () {
//	        $scope.upload($scope.files);
//	    });
		
		
		$scope.upload = function (files) {
			
			var urlBase = '/api/v1';
			
//			Only for patch/put
			var config = {};
		
			if (files && files.length) {
				
				 for (var i = 0; i < files.length; i++) {
				
					 var file = files[i];
					 var uploads = 0;
					 
					 $upload.upload({
						 url: urlBase + '/files/',
						 fields: {'ref': 'observations', 'ref_id': $scope.observation._id, 'content_type': file.type, 'name': file.name, 'size': file.size, 'owner': $rootScope.username }, //additional form fields
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

		$rootScope.disabledFn = function(){
			return !$scope.observationChanges;
		};


		$rootScope.nav.toolbar[1] = {disabled:$rootScope.disabledFn,text:'Lagre',btn_class:'primary',icon:'save',onclick:$scope.saveObservation};

		});




})();