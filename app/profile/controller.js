angular.module("profileApp").controller("userController",
	['$scope', '$http', 'userService', '$timeout','$rootScope', '$window',
		function($scope, $http, userService, $timeout, $rootScope, $window) {

			var urlBase = '/api/v1';

			//Always get the avatar!

			var needsReloading = false;
			// Menus
			$rootScope.nav = {toolbar: [], menus: []}; //reset
			$rootScope.nav.brand = 'FNLF Profil';


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
