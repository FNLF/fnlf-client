(function () {
	'use strict';
	angular.module('fnlf-login', ['http-auth-interceptor'])

		.controller('LoginController', function ($scope, loginService) {

			$scope.login = function () {
				loginService.login($scope.username, $scope.password);
			};

			$scope.tryLoginFromSession = function () {
				loginService.tryLoginFromSession();
			};

			$scope.logout = function () {
				loginService.logout();
			};

		});
})();


(function () {

	angular.module('fnlf-login').factory('GlobalsService',
		['$cookieStore', '$rootScope',
			function ($cookieStore, $rootScope) {

				var configs = { baseUrl: '/api/v1/' };

				var service = {};

				service.get = function (key) {

					return configs[key];
				};

				$rootScope.title = 'Login';

				return service;

			}]);


	angular.module('fnlf-login')
		.service('loginService', function ($rootScope, $http, authService, GlobalsService, $window, $location, $cookieStore, $q) {

			$rootScope.$on('event:auth-loginRequired', function () {
				$rootScope.error = 'Login is required';
				$rootScope.currentUserSignedIn = false;
				$rootScope.currentUserSignedOut = true;
			});
			$rootScope.$on('event:auth-loginConfirmed', function () {
				$rootScope.error = null;
				$rootScope.currentUserSignedIn = true;
				$rootScope.currentUserSignedOut = false;
			});

			this.getPath = function () {
				//return $location.path();
				//return $window.location.protocol + '//' + $window.location.host + $window.location.path;
				return $location.absUrl();
			}
			this.getAccessToken = function () {
				$window.alert('Olbjørn, hva ser du: ' + $location.search());
				if ($location.url().indexOf('access_token') > -1) {
					
					return $location.search()['access_token']; // ['access_token'];
				}
				return undefined;

			}

			this.getQueryParams = function () {

				return $location.search();

			}

			this.removeUrlParams = function () {
				$location.url($location.path());
			}

			this.login = function (username, password) {

				var deferred = $q.defer();

				$http.post(GlobalsService.get('baseUrl') + 'user/authenticate', {
					username: username,
					password: password
				}).success(function (response) {
					console.log(response);
					//$location.url($location.path()); //remove tokens and stuff
					if (response.success) {

						//Store in cookie:
						//$cookieStore.put('authToken', response.token64);
						//$cookieStore.put('username', username);
						$window.sessionStorage.token = response.token64;
						$window.sessionStorage.username = response.username;

						$rootScope.username = response.username;

						$http.defaults.headers.common.Authorization = 'Basic ' + response.token64;
						$rootScope.currentUserSignedIn = true;
						// Broadcast AND update tokens in buffers!
						authService.loginConfirmed('success', function (config) {
							config.headers["Authorization"] = 'Basic ' + response.token64;
							return config;
						});

						deferred.resolve({ status: 200, message: response.message });
					}
					else {
						deferred.reject({ status: 401, message: response.message });
					}
				}).error(function (data, status, headers, config) {
					//$location.url($location.path()); //remove tokens and stuff
					console.log(data);
					console.log(status);
					//Show login form
					$rootScope.currentUserSignedIn = false;
					//Abort all buffers
					authService.loginCancelled(data, status);

					$rootScope.error = 'Login experienced some difficulties. Maybe the backend did not respond?';
					deferred.reject({ status: status, message: data });

					return false;

				});
				return deferred.promise;
			};

			/**
			 * Load the tokens from the cookie
			 * Every time someone refreshes the page or enters a different application
			 *
			 * NB: Needs a
			 */
			this.tryLoginFromSession = function () {

				var authToken = $window.sessionStorage.token; //$cookieStore.get('authToken');
				var username = $window.sessionStorage.username; //$cookieStore.get('username');

				if (authToken === undefined) {
					$rootScope.currentUserSignedIn = false;
					authService.loginRequired();
				}
				else {
					$rootScope.username = username;
					$rootScope.authToken = authToken;
					$rootScope.currentUserSignedIn = true;




					$http.defaults.headers.common.Authorization = 'Basic ' + authToken;

					/**
					 * This will anyway trigger loginRequired on a 401, so it's redudant??
					 */
					$http.get(GlobalsService.get('baseUrl') + 'users/' + username).success(function (response) {

						//Show content, hide login form
						$rootScope.currentUserSignedIn = true;
						console.log('Login from session - success');

						if (typeof response.settings.default_club !== 'undefined') {
							$rootScope.default_club = response.settings.default_club;
						}
						//Broadcast the success update buffers!
						authService.loginConfirmed('success', function (config) {
							config.headers["Authorization"] = 'Basic ' + authToken;
							return config;
						});

						return true;

					}).error(function (data, status, headers, config) {

						//Show login form
						$rootScope.currentUserSignedIn = false;
						//Abort all buffers
						authService.loginCancelled(data, status);

						//Now just make sure to force login
						authService.loginRequired('Login is mandatory');

						return false;

					});


				}

			};

			this.logout = function () {
				delete $rootScope.username;
				delete $rootScope.authToken;
				//$cookieStore.remove('authToken');
				$window.sessionStorage.token = '';
				//Show login form
				$rootScope.currentUserSignedIn = false;
				//Abort all buffers
				authService.loginCancelled();

				//Clean up menu!
				$rootScope.nav.menus = [];
				$rootScope.nav.tollbar = [];

				//Now just make sure to force login
				authService.loginRequired('Login is mandatory');

				$location.path("/");
			};

			//Call this every time its started
			// Should be a login from cookie first, then if that dont work, broadcast a loginRequired
			if (this.tryLoginFromSession()) {

				authService.loginRequired('Login is mandatory');
			}



		});


})();


(function () {

	var fnlfLogin = function (loginService, ENV) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/shared/auth/views/login.html";

		directive.scope = {};

		directive.link = function ($scope, element, attrs) {
			$scope.error = '';

			$scope.access_token = loginService.getAccessToken(); //getQueryParams().access_token; //$location.search(); //['access_token'];
			$scope.return_path = loginService.getPath();

			$scope._auth_service = 'https://auth.nlf.no/auth';

			if(ENV.name == 'development') {
				$scope._client_id = 'kgnkzakr10zsi3fgmk23';
			} else {
				$scope._client_id = 'vekvwnndpezv4dqlr35c';
			}
			$scope._scope = 'read';
			$scope._shebang = 1;
			$scope._response_type = 'access_token';
			$scope._logging_in = false;
			$scope._oauth_error = loginService.getQueryParams().error;
			$scope._oauth_error_msg = loginService.getQueryParams().error_description;
			// Allow access_token to be transported in same path as previous username/passwords
			if (typeof $scope.access_token != 'undefined') {
				$scope._logging_in = true;

				loginService.login('access_token', $scope.access_token)
					.then(function () {
						$scope.error = null;
						$scope.info = null;

					},
						function (error) {
							if (error.status == 401) {
								$scope.error = '';
								$scope.info = 'Aksess token er ikke gyldig';
							} else if (error.status == 503) {
								$scope.error = 'Serveren fikk problemer';
								console.log(error);
							} else {
								$scope.error = 'Feil med serveren. Prøv igjen senere';
								console.log(error);
							}
						}).finally(function () {
							loginService.removeUrlParams();
							$scope._logging_in = false;
						});


			}

			$scope.tryLoginFromSession = function () {
				loginService.tryLoginFromSession();
			};

			$scope.logout = function () {
				loginService.logout();
			};

		};
		return directive;
	};

	angular.module('fnlf-login').directive('fnlfLogin', fnlfLogin);

	var fnlfLogout = function (loginService) {
		var directive = {};
		directive.restrict = 'E';
		directive.replace = true;
		directive.scope = {};
		directive.template = '<a href ng-click=\"logout()\"><i class=\"fa fa-power-off\"></i> Logg ut</a>';
		directive.link = function ($scope, element, attrs) {
			$scope.logout = function () {
				console.log("Logout");
				loginService.logout();
			};
		};
		return directive;
	};

	angular.module('fnlf-login').directive('fnlfLogout', fnlfLogout);

})();
