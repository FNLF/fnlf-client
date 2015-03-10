/**
 * 
 * Workflow directive
 * 
 * Skal bruke workflow servicen for å hente og utføre operasjoner mot observasjonens workflow
 * 
 */

angular.module('reportingApp')
	   .directive('filepreviews', function (RestService, ObservationService, $aside, $rootScope, $window) {
  
	var directive = {};

	directive.restrict = 'E';
	
	directive.scope = {
		observation: '=',
		save: '&',
	};
	
	directive.transcluded = true;
	
	directive.templateUrl = "components/observation/directives/files.html";
//	directive.template = function(tElement, tAttrs) { 
		
//		return '<div ng-repeat="f in thumbnails"> \
//					<div class="col-xs-6 col-md-2"> \
//					<a ng-click="openFileAside(f.objectid)" class="thumbnail"> \
//						<img ng-src="{{f.src}}" class="img-responsive"> \
//					</a> \
//					</div> \
//				</div> \
//				</div> \
//				<div ng-repeat="l in filelist"> \
//				<div><a href="{{l.url}}">{{l.name}}</a>{{l.size}} Bytes {{l.type}}</div><br /> \
//				</div>{{filelist | json}}'; 
//	};
	
	
	directive.controller = function ($scope, $rootScope, $location, $aside, $http, $q, $window) {
		var urlBase = '/api/v1';
		
		$scope.getFileList = function() {
			 return $scope.files;
		 };
		 
		 
		 $scope.buildFileList = function() {
			 
			 for(k in $scope.observation.files) {
				 
				 $scope.fetchFileInfo($scope.observation.files[k]).then(function(response) {
					 $scope.filelist.push({'name': response.name, 
						 'type': response.content_type,'size': bytesToSize(response.size), 
						 'url': urlBase + '/download/' + response._id + '?token=' + $window.sessionStorage.token, 
						 '_id': response._id});
					 
					 if(response.content_type.match(/image/g) != null) {
						 $scope.getImageFile(response._id);
					 }
				 });
			 };
		 };
		 
		 $scope.getImageFile = function(objectid) {
			 console.log('Getting file for preview!!!');
			 $scope.fetchImageFile(objectid).then(function(response) {
					
				 $scope.thumbnails.push({src: 'data:'+response.mimetype+';charset=utf8;base64,'+response.src, objectid: objectid}); 
			 });
			 
		 };
		 
		
		$scope.fetchFileInfo = function(objectid) {
			
			var request = $http({
				method : "get",
				url : urlBase + '/files/' + objectid + '?projection={"file": 0}&bambus'
			});
			return (request.then(handleSuccess, handleError));

		};
		$scope.fetchImageFile = function(objectid) {
			var request = $http({
				method : "get",
				url : urlBase + '/download/image/' + objectid + '/small'
			});
			return (request.then(handleSuccess, handleError));
			
		};
		
		$scope.fetchFullsizeFile = function(objectid) {
			var request = $http({
				method : "get",
				url : urlBase + '/download/image/' + objectid + '/large'
			});
			return (request.then(handleSuccess, handleError));

		};
		
		$scope.removeFile = function(objectid) {
			
			var index = $scope.observation.files.indexOf(objectid);
			
			if (index > -1) {
				$scope.observation.files.splice(index, 1);
				$scope.fileAside.hide();
				$scope.save(); //Calls $scope.saveObservation()
			};
			
		};
		
		
		
		function handleError(response) {
			if (!angular.isObject(response.data) || !response.data.message) {
				return ($q.reject("An unknown error occurred."));
			}
			return ($q.reject(response.data.message));
		}
		
		function handleSuccess(response) {
			console.log(response.data);
			return (response.data);
		};
		
		/**
		 * Normal opening of aside
		 */
		$scope.openFileAside = function(objectid) {
			
			 $scope.fetchFullsizeFile(objectid).then(function(response) {
				//Full size images are BIG 
				//$scope.filesrc = 'data:'+response.file.content_type+';charset=utf8;base64,'+response.file.file;
				$scope.filesrc = 'data:'+response.mimetype+';charset=utf8;base64,'+response.src;
			    $scope.fileid = objectid;
			    
			    $location.path('/observation/modal-route', false);
			    
				$scope.fileAside = $aside({
			        scope: $scope,
			        title: 'Filvisning',
			        //content: 'My Content', //Static custom content
			        show: true,
			        contentTemplate: '/app/reporting/components/observation/directives/filepreviews.html',
			        template: '/shared/partials/aside.html',
			        placement: 'full-left',
			        container: 'body',
			        backdrop: 'static',
			        animation: 'am-slide-left',
			        });  
			 });
		};
		
		// Needs to manually close aside on back button
		$rootScope.$on('$routeChangeStart', function(event, next, current) {
			if($scope.fileAside) {
			  if($scope.fileAside.$scope.$isShown && $location.path().indexOf('/modal-route') == -1) {
				  $scope.fileAside.hide(); 
			  }
			}
		});
		
		$scope.$on('aside.hide', function() {
		  if($location.path().indexOf('/modal-route') != -1) {
			  $window.history.back();
		  };
		});
		
		function bytesToSize(bytes) {
			   if(bytes == 0) return '0 Byte';
			   var k = 1000;
			   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
			   var i = Math.floor(Math.log(bytes) / Math.log(k));
			   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
			}
		
		
	};

		
	directive.link = function($scope, element, attrs) {
				
		$scope.$watch('observation',function(newValue,oldValue) {
			
			if(newValue) {
				
				$scope.thumbnails = [];
				$scope.filelist = [];
				
				$scope.buildFileList();
				
				
		};
	});
		
	};
		
	
	return directive;
	
});



