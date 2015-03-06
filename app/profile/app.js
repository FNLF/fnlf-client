(function() {

	var profileApp = angular.module('profileApp', [ 'ngRoute', 'ui.bootstrap', 'ui.select', 'ngSanitize', 'ngCookies', 
	                                                'angular-loading-bar',
	                                                'fnlf-login','imageupload', 'resolve']);

	profileApp.config([ 'cfpLoadingBarProvider',
			function(cfpLoadingBarProvider) {
				cfpLoadingBarProvider.includeBar = true;
				cfpLoadingBarProvider.includeSpinner = true;
			} ]);

})();

angular.module("profileApp").controller("userController", 
							['$scope', '$http', 'userService', '$timeout','$rootScope', '$window',
							function($scope, $http, userService, $timeout, $rootScope, $window) {
	
	var urlBase = '/api/v1';
	
	//Always get the avatar!
	
	   var needsReloading = false;
	   
	   $scope.loadUser = function() {
	   
		   userService.getUser().then(function(data) {
			   
			   $scope.user = data;
			   $scope.profile = {};
			   $scope.profile.settings = data.settings;
			   $scope.profile.custom = data.info;
			   $scope.profile.info = data.info;
			   
				$scope.clubs = {};
				userService.getMelwinUser().then(function(data) {
					
					//Default club auto
					if(typeof $scope.profile.settings == 'undefined') $scope.profile.settings = {};
					if(typeof $scope.profile.settings.default_club == 'undefined' && data.membership.clubs.length == 1) {
						$scope.profile.settings.default_club = data.membership.clubs[0];
						needsReloading = true;
						$scope.saveUser($scope.profile, $scope.user._id, $scope.user._etag);
					}
					
					userService.getClubs(data.membership.clubs).then(function(response) {
						$scope.clubs = response._items;
						
					});
				});
			   
		   });
	   
	   };
	   $scope.loadUser();
	   
	   $scope.error = undefined;
	   
	   $scope.saveUser = function(){
		   
		   userService.saveUser($scope.profile, $scope.user._id, $scope.user._etag).then(function(response) {
			   
			   $scope.user._etag = response._etag;
			   
			   $scope.success = "Din info ble lagret";
			   
			   if(needsReloading) {
				   $scope.loadUser();
				   needsReloading = false;
				   $window.location.reload();
			   }
			   
		   });
		   
		   
	   };
	
	
	
	$scope.getAvatar = function() {
		$scope.avatar = {};
		userService.getUserAvatar().then(function(data) {
			if(data.avatar) {
				$scope.avatar.dataURL = 'data:'+data.avatar.content_type+';base64,'+data.avatar.file;
			}
			else {
				$scope.avatar.dataURL = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
			}
		});
	};

	
	
	   
//	$scope.$watch('image', function () {
//        $scope.upload($scope.image.resized);
//    });
	   
	   function dataURItoBlob(dataURI) {
		    // convert base64/URLEncoded data component to raw binary data held in a string
		    var byteString;
		    if (dataURI.split(',')[0].indexOf('base64') >= 0)
		        byteString = atob(dataURI.split(',')[1]);
		    else
		        byteString = unescape(dataURI.split(',')[1]);

		    // separate out the mime component
		    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		    // write the bytes of the string to a typed array
		    var ia = new Uint8Array(byteString.length);
		    for (var i = 0; i < byteString.length; i++) {
		        ia[i] = byteString.charCodeAt(i);
		    }

		    return new Blob([ia], {type:mimeString});
		};
	   
    
	$scope.upload = function (image) {
		
		var config = {};
		config.headers = {};
		config.headers['If-Match'] = $scope.user._etag;
		config.headers['Content-Type'] = undefined;
		
		if(image) {
			
			var blob = dataURItoBlob(image);
			var formData = new FormData();
			formData.append('avatar', blob);
			 
			$http({ 
				method: 'PATCH', 
				url: urlBase + '/users/' + $scope.user._id, 
				data: formData, 
				headers: config.headers,
				transformRequest: angular.identity
			
//			$http.patch(urlBase + '/users/' + $scope.userid, formData, {
//						headers: config.headers,
//						transformRequest: angular.identity,
			}).success(function(result) {
				$scope.uploadedImgSrc = result.src;
				$scope.sizeInBytes = result.size;
				$scope.getAvatar();
				$scope.user._etag = result._etag;
				$scope.success = "Avatar oppdatert";
			});
			};
			
		};
	
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
					url : urlBase + '/users/' + $rootScope.username,
				});
				return (request.then(handleSuccess, handleError));
	
			};
			
			this.saveUser = function(data, _id, _etag) {
				
				var config = {};
				config.headers = {};
				config.headers['If-Match'] = _etag;
				config.headers['Content-Type'] = 'application/json';
				
				var request = $http({
					method : "patch",
					headers: config.headers,
					data: data,
					url : urlBase + '/users/' + _id,
				});
				return (request.then(handleSuccess, handleError));
				
			};
			
			this.getMelwinUser = function() {
				
				var request = $http({
					method : "get",
					url : urlBase + '/melwin/users/' + $rootScope.username,
				});
				return (request.then(handleSuccess, handleError));
				
			};
			
			this.getClubs = function(clubs) {
				
				var request = $http({
					method : "get",
					url : urlBase + '/clubs/?where={"id": {"\$in": ' + JSON.stringify(clubs) + '}}&projection={"id": 1, "name": 1}'
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
		
			this.getUserId = function() {
				
				return $rootScope.userid;
			};
	
			// I transform the error response, unwrapping the
			// application dta from
			// the API response payload.
			function handleError(response) {
				// The API response from the server should be
				// returned in a
				// normalized format. However, if the request
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