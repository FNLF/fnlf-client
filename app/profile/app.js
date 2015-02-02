(function() {

	var profileApp = angular.module('profileApp', [ 'ngRoute', 'ui.bootstrap',
	                                                'ui.select', 'ngSanitize', 'ngCookies', 'angular-loading-bar','fnlf-login' ]);

	profileApp.config([ 'cfpLoadingBarProvider',
			function(cfpLoadingBarProvider) {
				cfpLoadingBarProvider.includeBar = true;
				cfpLoadingBarProvider.includeSpinner = true;
			} ]);

})();

angular.module("profileApp")
	   .controller("userController", function($scope, userService, loginService, $location, $route) {

					/**
					 * Wrap the logout here!
					 */
					$scope.logout = function() {
						
						loginService.logout();
					};
					
					$scope.userArray = [];
					
					$scope.editIndex = -1;
					$scope.editObject = {
						firstname : "",
						lastname : "",
						imgSrc : "",
						location : {
							city : "",
							zip : "",
							street : ""
						},
						phone : "",
						email : "",
					};

					//Promise!
					userService.getUser().then(function(data) {
						data.imgSrc = "http://3.bp.blogspot.com/-2hitMEJeVjo/UmrJuPIFa6I/AAAAAAAAZFQ/Hmu_ieZ3RWQ/s1600/olivia-munn.jpg";
						$scope.userArray = [data];
					});
					
					console.log("DADADA");
					console.log($scope.userArray);

					// edit button click
					$scope.editingPerson = function(personIndex) {
						
						$scope.editObject = angular.copy($scope.userArray[personIndex]);
						
						/*
						 * WHY COPY??? Because, I wont to seperate the edits
						 * from the origanal array. Doing this allows the user
						 * to cancel their edit and since the fields are not
						 * data-binded to the origanl array, it won't make
						 * anychanges.
						 */
						$scope.editIndex = personIndex;
					};

					// cancelEdit
					$scope.cancelEdit = function() {
						$scope.editIndex = -1;

					};

					// saveEdit
					$scope.saveEdit = function(personIndex) {
						userService.updateInfo(personIndex, $scope.editObject);
						$scope.editIndex = -1;
					};
				});

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