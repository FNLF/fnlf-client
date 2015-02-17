(function() {

	var profileApp = angular.module('profileApp', [ 'ngRoute', 'ui.bootstrap',
	                                                'angularFileUpload',
	                                                'ui.select', 'ngSanitize', 'ngCookies', 'angular-loading-bar','fnlf-login','xeditable','imageupload', ]);

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
		['$scope', '$http', 'userService', '$timeout','$rootScope', 
		 function($scope, $http, userService, $timeout, $rootScope) {
	
	var urlBase = '/api/v1';
	
	$scope.usingFlash = FileAPI && FileAPI.upload != null;
	$scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
	
	//Always get the avatar!
	
	$scope.getAvatar = function() {
		$scope.avatar = {};
		userService.getUserAvatar().then(function(data) {
			$scope.avatar.dataURL = 'data:'+data.avatar.content_type+';base64,'+data.avatar.file;
			$scope.userid = data._id;
			$scope._etag = data._etag;
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
		console.log("UPLOAAAAAAAAAD");
		
		var config = {};
		config.headers = {};
		config.headers['If-Match'] = $scope._etag;
		config.headers['Content-Type'] = undefined;
		
		if(image) {
			
			var blob = dataURItoBlob(image);
			var formData = new FormData();
			formData.append('avatar', blob);
			 
			$http({ 
				method: 'PATCH', 
				url: urlBase + '/users/' + $scope.userid, 
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
				
			});
			};
			
		};
		
//        if (files && files.length) {
//            for (var i = 0; i < files.length; i++) {
//                
//            	var file = files[i];
//            	
//                $upload.upload({
//                    url: urlBase + '/users/' + $scope.userid,
//                    //fields: {'username': $scope.username}, //additional form fields
//                    file: file,
//                    method: 'PATCH',
//                    fileFormDataName: 'avatar', //Assign file to field name
//                    headers: config.headers //Add etag
//                }).progress(function (evt) {
//                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//                    $scope.uploadProgress = progressPercentage;
//                    console.log('progress: ' + progressPercentage + '% ');
//                }).success(function (data, status, headers, config) {
//                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
//                });
//            }
//        }
//    };
    
 // Takes a data URI and returns the Data URI corresponding to the resized image at the wanted size.
    function resizedataURL(datas, wantedWidth, wantedHeight)
        {
            // We create an image to receive the Data URI
            var img = document.createElement('img');

            // When the event "onload" is triggered we can resize the image.
            img.onload = function()
                {        
                    // We create a canvas and get its context.
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');

                    // We set the dimensions at the wanted size.
                    canvas.width = wantedWidth;
                    canvas.height = wantedHeight;

                    // We resize the image with the canvas method drawImage();
                    ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);

                    var dataURI = canvas.toDataURL();

                    /////////////////////////////////////////
                    // Use and treat your Data URI here !! //
                    /////////////////////////////////////////
                };

            // We put the Data URI in the image's src attribute
            return datas;
        }
    // Use it like that : resizedataURL('yourDataURIHere', 50, 50);
    
    
	$scope.generateThumb = function(file) {
		
		if (file != null) {
			
			if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
					$timeout(function() {
						var fileReader = new FileReader();
						fileReader.readAsDataURL(file);
						
						fileReader.onloadend = function(e) {
							$timeout(function() {

						        var img = new Image();
						        var canvas = document.createElement('canvas');
						        var ctx = canvas.getContext("2d");
						        var canvasCopy = document.createElement("canvas");
						        var copyContext = canvasCopy.getContext("2d");
						        var maxWidth = 300;
						        var maxHeight = 200;

						        img.onload = function()
						        {
						            var ratio = 1;

						            if(img.width > maxWidth)
						                ratio = maxWidth / img.width;
						            else if(img.height > maxHeight)
						                ratio = maxHeight / img.height;

						            canvasCopy.width = img.width;
						            canvasCopy.height = img.height;
						            copyContext.drawImage(img, 0, 0);

						            canvas.width = img.width * ratio;
						            canvas.height = img.height * ratio;
						            ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);
						        };

						        //img.src = fileReader.result;
						        file.dataUrl = fileReader.result;
								
						        //file.dataUrl = e.target.result;
//								render(e.target.result);
						        //file.dataUrl = resizedataURL(e.target.result, 200,300);
							});
						};
					});
			}
		}
	};

	
	function resizeImage(file) {
		var reader = new FileReader();
		    reader.onloadend = function() {
		 
		    var tempImg = new Image();
		    tempImg.src = reader.result;
		    
		    tempImg.onload = function() {
		 
		        var MAX_WIDTH = 400;
		        var MAX_HEIGHT = 300;
		        var tempW = tempImg.width;
		        var tempH = tempImg.height;
		        if (tempW > tempH) {
		            if (tempW > MAX_WIDTH) {
		               tempH *= MAX_WIDTH / tempW;
		               tempW = MAX_WIDTH;
		            }
		        } else {
		            if (tempH > MAX_HEIGHT) {
		               tempW *= MAX_HEIGHT / tempH;
		               tempH = MAX_HEIGHT;
		            }
		        }
		 
		        var canvas = document.createElement('canvas');
		        canvas.width = tempW;
		        canvas.height = tempH;
		        var ctx = canvas.getContext("2d");
		        ctx.drawImage(this, 0, 0, tempW, tempH);
		        var dataURL = canvas.toDataURL("image/jpeg");
		      };
		 
		   };
		   reader.readAsDataURL(file);
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
		
			this.getUserId = function() {
				
				return $rootScope.userid;
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