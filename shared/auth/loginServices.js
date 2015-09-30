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

				var configs = {baseUrl: '/api/v1/'};

				var service = {};

				service.get = function (key) {

					return configs[key];
				};
				
				$rootScope.title = 'Login';

				return service;

			}]);


	angular.module('fnlf-login')
		.service('loginService', function ($rootScope, $http, authService, GlobalsService, $window, $location, $cookieStore) {

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


			this.login = function (username, password) {
				console.log('Manual login');
				console.log(username + ' ' + password);

				$http.post(GlobalsService.get('baseUrl') + 'user/authenticate', {
					username: username,
					password: password
				}).success(function (response) {
						console.log(response);

						if (response.success) {

							//Store in cookie:
							//$cookieStore.put('authToken', response.token64);
							//$cookieStore.put('username', username);
							$window.sessionStorage.token = response.token64;
							$window.sessionStorage.username = username;
							
							$rootScope.username = username;

							$http.defaults.headers.common.Authorization = 'Basic ' + response.token64;
							$rootScope.currentUserSignedIn = true;
							// Broadcast AND update tokens in buffers!
							authService.loginConfirmed('success', function (config) {
								config.headers["Authorization"] = 'Basic ' + response.token64;
								return config;
							});


						}
						else {

							$rootScope.error = response.message;
						}
					}).error(function (data, status, headers, config) {

						//Show login form
						$rootScope.currentUserSignedIn = false;
						//Abort all buffers
						authService.loginCancelled(data, status);

						$rootScope.error = 'Login experienced some difficulties. Maybe the backend did not respond?';
						return false;

					});
			};

			/**
			 * Load the tokens from the cookie
			 * Every time someone refreshes the page or enters a different application
			 *
			 * NB: Needs a
			 */
			this.tryLoginFromSession = function () {

				console.log('Sessionstorage');
				console.log($window.sessionStorage);
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
					

					console.log('Trying to verify token ' + authToken + ' for username ' + username);
					console.log(username);

					$http.defaults.headers.common.Authorization = 'Basic ' + authToken;

					/**
					 * This will anyway trigger loginRequired on a 401, so it's redudant??
					 */
					$http.get(GlobalsService.get('baseUrl') + 'users/' + username).success(function (response) {

						//Show content, hide login form
						$rootScope.currentUserSignedIn = true;
						console.log('Login from session - success');
						
						if(typeof response.settings.default_club !== 'undefined') {
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

	var fnlfLogin = function (loginService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/shared/auth/views/login.html";

		directive.scope = {};

		directive.link = function ($scope, element, attrs) {

			$scope.login = function () {
				loginService.login($scope.username, $scope.password);
			};

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
    		directive.replace=true;
    		directive.scope = {};
    		directive.template='<a href ng-click=\"logout()\"><i class=\"fa fa-power-off\"></i> Logg ut</a>';
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

