(function() {

	var profileApp = angular.module('profileApp', [ 'ngRoute', 'ui.bootstrap',
	                                                'angularFileUpload',
	                                                'ui.select', 'ngSanitize', 'ngCookies', 'angular-loading-bar','fnlf-login','xeditable' ]);

	profileApp.config([ 'cfpLoadingBarProvider',
			function(cfpLoadingBarProvider) {
				cfpLoadingBarProvider.includeBar = true;
				cfpLoadingBarProvider.includeSpinner = true;
			} ]);

})();

angular.module("profileApp").run(function(editableOptions) {
	  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
	});

angular.module("profileApp")
	   .controller("userController", function($scope, userService, loginService, $location, $route) {
		   
		   userService.getUser().then(function(data) {
			   
			   $scope.user = data;
			   console.log( $scope.user.firstname);
			   
		   });
			  
//		   var _etag = u._etag;
//		   var _id = u._id;
//		   
//		   delete(u._etag);
//		   delete(u._id);
		   //...
		   
	   });

/**
 * Avatar
 * 
 * Upload
 */
angular.module("profileApp").controller("avatarController", 
		['$scope', '$upload', 'userService', '$timeout','$rootScope', 
		 function($scope, $upload, userService, $timeout, $rootScope) {
	
	var urlBase = '/api/v1';
	
	$scope.usingFlash = FileAPI && FileAPI.upload != null;
	$scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
	
	//Always get the avatar!
	
	$scope.getAvatar = function(file) {
		
		userService.getUserAvatar().then(function(data) {
			file.dataurl = 'data:'+data.avatar.content_type+';base64,'+data.avatar.file;
	});	   
//		   var fileReader = new FileReader();
//			fileReader.readAsDataURL(file);
//			fileReader.onload = function(e) {
//				$timeout(function() {
//					file.dataUrl = e.target.result;
//				});
//			}
//		   
//		   picFile[0].dataUrl
		   
	   };
	
	$scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
    
	$scope.upload = function (files) {
		console.log("UPLOAAAAAAAAAD");
		
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: urlBase + '/users/' + $rootScope.userid,
                    //fields: {'username': $scope.username},
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                });
            }
        }
    };
    
	$scope.generateThumb = function(file) {
		
		if (file != null) {
			console.log("Filereader");
			console.log($scope.fileReaderSupported);
			if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
				console.log("THUMBING");
					$timeout(function() {
					var fileReader = new FileReader();
					fileReader.readAsDataURL(file);
					fileReader.onload = function(e) {
						$timeout(function() {
							file.dataUrl = e.target.result;
						});
					}
					});
			}
		}
	}
	
	
}]);

angular.module("profileApp")
	   .service("userService",['$http','$q','$rootScope', function($http, $q, $rootScope) {
							
			var urlBase = '/api/v1';
	
	
			/**
			 * Change workflow state if access
			 * 
			 * 
			 */
			this.getUser = function() {
	
				var request = $http({
					method : "get",
					url : urlBase + '/melwin/users/' + $rootScope.username,
				});
				return (request.then(handleSuccess, handleError));
	
			};
			
			this.getUserAvatar = function() {
				
				var request = $http({
					method : "get",
					url : urlBase + '/users/' + $rootScope.username +'?projection={\"avatar\": 1}',
				});
				return (request.then(handleSuccess, handleError));
				
			};
	
			// updating person - no $scope, no injection allowable???
			this.updateInfo = function(personIndex, obj) {
				$scope.userArray.splice(personIndex, 1, obj);
			};
	
			// I transform the error response, unwrapping the
			// application dta from
			// the API response payload.
			function handleError(response) {
				// The API response from the server should be
				// returned in a
				// nomralized format. However, if the request
				// was not handled by the
				// server (or what not handles properly - ex.
				// server error), then we
				// may have to normalize it on our end, as best
				// we can.
				if (!angular.isObject(response.data) || !response.data.message) {
					return ($q.reject("An unknown error occurred."));
				}
				// Otherwise, use expected error message.
				return ($q.reject(response.data.message));
			}
			// I transform the successful response, unwrapping
			// the application data
			// from the API response payload.
			function handleSuccess(response) {
				console.log(response.data);
				return (response.data);
			}
	
		} ]);