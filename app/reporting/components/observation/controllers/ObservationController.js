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
		.controller('ObservationController', function ($scope, ObservationService,Definitions,$routeParams,$timeout, $upload, $http, $window, DoNotReloadCurrentTemplate, $rootScope) {
			
			//This is aside back button hack
			DoNotReloadCurrentTemplate($scope);
			
			var observationId = $routeParams.id;
			$scope.observation = {id:observationId};
			$scope.observationChanges = false;

			$scope.ui=$routeParams.ui;

			$scope.loadObservation = function(){
				$scope.observation = {};
				ObservationService.getObservationById(observationId, function(obs){

					$scope.observation = obs;
					ObservationService.initObservation($scope.observation);
					$scope.observationChanges = false;
					$timeout(function(){
						$scope.observationChanges = false;
					},10);
				});
			};
			$scope.loadObservation();
			
			$rootScope.loadObservation = function() {
				$scope.loadObservation();
			};
			
			$rootScope.saveObservation = function() {
				$scope.saveObservation();
			};


			var observationTypes = Definitions.getObservationTypes();

			$scope.observationTypesArray = {};

			observationTypes.forEach(function(t){
				$scope.observationTypesArray[t.id] = t.name;
			});


		$scope.saveObservation = function () {

			ObservationService.updateObservation($scope.observation,function(updated){
				$scope.observation = updated;
				ObservationService.initObservation($scope.observation);
				/**
				 * Reset saved/unsaved label
				 */
				$timeout(function(){
					$scope.observationChanges = false;
					$window.onbeforeunload = null;
				},100);

			});
		};

		
		/**
		 * Triggers saved/unsaved label
		 */
		$scope.observationChanges = false;
		$scope.$watch('observation', function(changedObs,oldObs) {
			if(oldObs._id) {
				
				$window.onbeforeunload = function(){
			        return 'You have unsaved observation data';
			      };
				
				console.log("Changed");
				console.log(oldObs);
				console.log("->");
				console.log(changedObs);
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
								 $scope.observation.files.push(data._id);
							 }
						 
						 }).then(function(success, error, progress) {
							//Only save when last upload returns
							uploads++;
						 	if(files.length == uploads) $scope.saveObservation();
					 	});
					 }
				 
				 };
		 };
		var disabledFn = function(){
			return !$scope.observationChanges;
		};


		var saveButton = {disabled:disabledFn,text:'Lagre',btn_class:'primary',icon:'save',onclick:$scope.saveObservation};
		$rootScope.toolbar.savebutton=saveButton;

		});
	

})();