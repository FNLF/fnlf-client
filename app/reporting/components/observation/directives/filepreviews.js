/**
 * 
 * Workflow directive
 * 
 * Skal bruke workflow servicen for å hente og utføre operasjoner mot observasjonens workflow
 * 
 */


angular.module('reportingApp')
	   .directive('filepreviews', function (RestService, ObservationService, $aside) {
  
	var directive = {};

	directive.restrict = 'E';
	
	directive.scope = {
		observation: '=',
	};
	
	directive.transcluded = true;
	
	directive.template = function(tElement, tAttrs) { 
		
		return '<div ng-repeat="f in thumbnails"> \
					<div class="col-xs-4 col-md-1"> \
					<a ng-click="openFileAside(f.objectid)" class="thumbnail"> \
						<img ng-src="{{f.src}}"> \
					</a> \
					</div> \
				</div>'; 
	};
	
	
	directive.controller = function ($scope, $route, $http, $q) {

		$scope.getFileList = function() {
			 return $scope.files;
		 };
		 
		 $scope.getFile = function(objectid) {
			 console.log('Getting file for preview!!!');
			 $scope.fetchFile(objectid).then(function(response) {
					
				 $scope.thumbnails.push({src: 'data:'+response.mimetype+';charset=utf8;base64,'+response.src, objectid: objectid}); 
			 });
			 
		 };
		 
		
		$scope.fetchFile = function(objectid) {
			var urlBase = '/api/v1';
			var request = $http({
				method : "get",
				url : urlBase + '/download/' + objectid + '/small'
			});
			return (request.then(handleSuccess, handleError));

		};
		
		$scope.fetchFullsizeFile = function(objectid) {
			var urlBase = '/api/v1';
			var request = $http({
				method : "get",
				url : urlBase + '/download/' + objectid + '/large'
			});
			return (request.then(handleSuccess, handleError));

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
		
		$scope.openFileAside = function(objectid) {
			
			 $scope.fetchFullsizeFile(objectid).then(function(response) {
				//Full size images are BIG 
				//$scope.filesrc = 'data:'+response.file.content_type+';charset=utf8;base64,'+response.file.file;
				$scope.filesrc = 'data:'+response.mimetype+';charset=utf8;base64,'+response.src;
			    
				$scope.myAside = $aside({
			        scope: $scope,
			        title: 'Filvisning',
			        //content: 'My Content', //Static custom content
			        show: true,
			        contentTemplate: '/app/reporting/components/observation/directives/filepreviews.html',
			        template: '/shared/partials/aside.html',
			        placement: 'full-left',
			        container: 'body',
			        animation: 'am-slide-left',
			        });  
			 });
		};
		
		
	};

		
	directive.link = function($scope, element, attrs) {
		
		$scope.$watch('observation',function(newValue,oldValue) {
			
			if(newValue) {
				var urlBase = '/api/v1';
				
				$scope.thumbnails = [];
				
				for(key in $scope.observation.files) {
					
					$scope.getFile($scope.observation.files[key]);
				};
				
		};
	});
		
	};
		
	
	return directive;
	
});



