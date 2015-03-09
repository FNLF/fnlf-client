(function() {

	var usersApp = angular.module('usersApp', [ 'ngRoute', 'ui.bootstrap',
			'ui.select', 'ngSanitize', 'ngCookies', 'angular-loading-bar',
			'fnlf-login', 'resolve', 'ngTable' ]);

	usersApp.config([ 'cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeBar = true;
		cfpLoadingBarProvider.includeSpinner = true;
	} ]);

})();

angular.module("usersApp").controller("usersLocalController",[
				'$scope',
				'$http',
				'usersService',
				'$timeout',
				'$rootScope',
				'$window',
				'ngTableParams',
				'$filter',
				'$routeParams',
				function($scope, $http, usersService, $timeout, $rootScope, $window, ngTableParams, $filter, $routeParams) {
					
					if($routeParams.userid) $scope.userId = $routeParams.userid;
					
					$scope.users = [];
					
					function ArrNoDupe(a) {
					    var temp = {};
					    for (var i = 0; i < a.length; i++)
					        temp[a[i]] = true;
					    var r = [];
					    for (var k in temp)
					        r.push(k);
					    return r;
					}
					

					
					$scope.getAllUsers = function() {
						console.log("HUHEU");
						usersService.getAllUsers().then(function(r) {
							
							$scope.users = r._items;
							
							$scope.usersTable = new ngTableParams({
						        page: 1,            // show first page
						        count: 10,           // count per page
						        sorting: {
						            name: 'asc'     // initial sorting
						        }
						    }, {
						        total: $scope.users.length, // length of data
						        getData: function($defer, params) {
						        	var filteredData = params.filter() ? $filter('filter')($scope.users, params.filter()) : $scope.users;
						            var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
						            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
						            params.settings({ counts: orderedData.length > 10 ? [10, 25, 50] : []});
						        },
						        $scope: $scope
						    });
						});
					};
					
					


				} ]);

angular.module("usersApp").service("usersService",['$http',	'$q', '$rootScope', function($http, $q, $rootScope) {

					var urlBase = '/api/v1';
					
					
					
					this.getUsers = function(userid) {
						
						var request = $http({
							method : "get",
							url : urlBase + '/users/'+userid,
							
						});
						return (request.then(handleSuccess, handleError));
					};
					
					this.getAllUsers = function() {
						
						var request = $http({
							method : "get",
							url : urlBase + '/users/?max_results=5000',
							
						});
						return (request.then(handleSuccess, handleError));
					};
					
					

					function handleError(response) {

						if (!angular.isObject(response.data)
								|| !response.data.message) {
							return ($q.reject("An unknown error occurred."));
						}
						// Otherwise, use expected error message.
						return ($q.reject(response.data.message));
					}
					function handleSuccess(response) {
						console.log(response.data);
						return (response.data);
					}

				} ]);