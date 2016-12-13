/**
 *
 * Workflow directive
 *
 * Skal bruke workflow servicen for å hente og utføre operasjoner mot observasjonens workflow
 *
 */

angular.module('reportingApp')
	   .directive('files', function (RestService, ObservationService, FileService, $rootScope, $window) {

	var directive = {};

	directive.restrict = 'E';

	directive.scope = {
		observation: '=',
		save: '&',
		editmode: '@',
		acl: '='
	};

	directive.transcluded = true;

	directive.templateUrl = "observation/directives/files.html";



	directive.controller = function ($scope, $rootScope, $location, $http, $q, $window) {
		var urlBase = '/api/v1';

		$scope.thumbnails = [];
		$scope.filelist = [];
		$scope.nonimages = [];

		$scope.getFileList = function() {
			 return $scope.files;
		 };

		 $scope.buildFileList = function() {
			$scope.thumbnails = [];
			$scope.filelist = [];
			$scope.nonimages = [];
			console.log($scope.observation.files);

			angular.forEach($scope.observation.files,function(file){
				FileService.buildFile(file,$scope.filelist,$scope.nonimages,$scope.thumbnails,$window.sessionStorage.token);
			});


		 };

		 $scope.buildFile = function(file) {
		 	if(!angular.isUndefined(file.f)){
				FileService.buildFile(file,$scope.filelist,$scope.nonimages,$scope.thumbnails,$window.sessionStorage.token);
		 	}
		 };

		 $scope.getImageFile = function(objectid, filename, filesize) {
			 $scope.fetchImageFile(objectid).then(function(response) {

				 $scope.thumbnails.push({src: 'data:'+response.mimetype+';charset=utf8;base64,'+response.src, objectid: objectid, filename:filename, filesize:filesize});
			 });

		 };




		$scope.removeFile = function(objectid) {

			//var index = $scope.observation.files.indexOf(objectid);
			var index = $scope.getIndexIfObjWithOwnAttr($scope.observation.files, 'f', objectid);

			if (index > -1) {

				$scope.observation.files.splice(index, 1);
				$scope.save(); //Calls $scope.saveObservation()
				$scope.buildFileList();
			};



		};


		$scope.getIndexIfObjWithOwnAttr = function(array, attr, value) {
		    for(var i = 0; i < array.length; i++) {
		        if(array[i].hasOwnProperty(attr) && array[i][attr] === value) {
		            return i;
		        }
		    }
		    return -1;
		};

		$scope.openFile = function(objectid,filename,filesize) {
			console.log(objectid+" "+filename+" "+filesize);
			$location.search('ui','file');
			$location.search('id',objectid);
			$location.search('f',filename);
		};


	};


	directive.link = function($scope, element, attrs) {



	};


	return directive;

});



