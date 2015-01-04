/**
 * 
 * Using cookies OR $window.sessionStorage (remember to inject $window...)
 * 
 */


(function() {
	'use strict';
	angular.module('login', [ 'http-auth-interceptor'])

	.controller('LoginController',  function($scope, $rootScope, $http, authService, GlobalsService, $window, $location, $cookieStore) {
		
		
		$scope.login = function() {
			console.log('Manual login');
			console.log($scope.username + ' ' + $scope.password );
			
			$http.post( GlobalsService.get('baseUrl') + 'user/authenticate', { username: $scope.username, password: $scope.password })
            
			.success(function (response) {
                console.log(response);
                
                if(response.success) {
                	
                	//Store in cookie:
                	//$cookieStore.put('authToken', response.token64);
                    //$cookieStore.put('username', username);
                	$window.sessionStorage.token = response.token64;
                	$window.sessionStorage.username = $scope.username;
                	
                	$http.defaults.headers.common.Authorization = 'Basic ' + response.token64;

                	// Broadcast AND update tokens in buffers!
                	authService.loginConfirmed('success', function(config){
                		  config.headers["Authorization"] = 'Basic ' + response.token64;
                		  return config;
                	});

                	
                }
                else {
                	
                	$scope.error = response.message;
                }
			});
		};
		
		/**
		 * Load the tokens from the cookie
		 * Every time someone refreshes the page or enters a different application
		 * 
		 * NB: Needs a 
		 */
		$scope.tryLoginFromSession = function(){
			
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
				 $http.get(GlobalsService.get('baseUrl') + 'users/' + username).success(function(response) {
				     
					 //Show content, hide login form
					 $rootScope.currentUserSignedIn = true;
					 console.log('Login from session - success');
					 //Broadcast the success update buffers!
					 authService.loginConfirmed('success', function(config){
						 config.headers["Authorization"] = 'Basic ' + authToken;
						 return config;
					 });
					 
					 return true;
					 
				 }).error(function(data, status, headers, config) {
					 
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
		 
		 $scope.logout = function() {
	            delete $rootScope.username;
	            delete $rootScope.authToken;
	            //$cookieStore.remove('authToken');
	            $window.sessionStorage.token = '';
	            //Show login form
				$rootScope.currentUserSignedIn = false;
				//Abort all buffers
				authService.loginCancelled();
				 
				//Now just make sure to force login
				authService.loginRequired('Login is mandatory');
	            
	            $location.path("/");
	        };
		
		//Call this every time its started
		// Should be a login from cookie first, then if that dont work, broadcast a loginRequired
		if(!$scope.tryLoginFromSession()) {
			
			authService.loginRequired('Login is mandatory');
		}	
	});
})();

