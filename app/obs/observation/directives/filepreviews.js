/**
 * 
 * Workflow directive
 * 
 * Skal bruke workflow servicen for å hente og utføre operasjoner mot observasjonens workflow
 * 
 */

angular.module('reportingApp')
	   .directive('filepreviews', function (RestService, ObservationService, FileService, $rootScope, $window) {
  
	var directive = {};

	directive.restrict = 'E';
	
	directive.scope = {
		observation: '=',
		save: '&',
		editmode: '@',
		acl: '='
	};
	
	directive.transcluded = true;
	
	directive.templateUrl = "observation/directives/filepreviews.html";

	
	
	directive.controller = function ($scope, $rootScope, $location, FileService) {
		var urlBase = '/api/v1';

		$scope.removeFile = function(objectid) {

			//var index = $scope.observation.files.indexOf(objectid);
			var index = $scope.getIndexIfObjWithOwnAttr($scope.observation.files, 'f', objectid);

			if (index > -1) {

				$scope.observation.files.splice(index, 1);
				$scope.save(); //Calls $scope.saveObservation()
				$location.search(ui,'');
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

		var load = function(){
			var objectid = $location.search().id;


			FileService.fetchFileInfo(objectid)
				.then(function(response){
					$scope.filename = response.name;
					$scope.filesize = FileService.bytesToSize(response.size);
					$scope.filetype = response.content_type;

				});

			FileService.fetchFullsizeFile(objectid)
				 .then(function(response) {
        				//Full size images are BIG
        				//$scope.filesrc = 'data:'+response.file.content_type+';charset=utf8;base64,'+response.file.file;
        				$scope.filesrc = 'data:'+response.mimetype+';charset=utf8;base64,'+response.src;
        			    $scope.fileid = objectid;



		});

		};
		load();
	};

	directive.link = function($scope, element, attrs) {


		
	};
		
	
	return directive;
	
});



