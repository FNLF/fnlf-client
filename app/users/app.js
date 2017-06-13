(function() {

	var usersApp = angular.module('usersApp', [ 'ngRoute', 'ui.bootstrap',
			'ui.select', 'ngSanitize', 'ngCookies', 'angular-loading-bar',
			'fnlf-login', 'resolve', 'ngTable', 'fnlf-services',
			 'angled-navbar.directives' ]);

	usersApp.config([ 'cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeBar = true;
		cfpLoadingBarProvider.includeSpinner = true;
	} ]);

})();

angular.module("usersApp").controller("usersLocalController",[
				'$scope',
				'$http',
				'usersService',
				'Appswitcher',
				'$timeout',
				'$rootScope',
				'$window',
				'ngTableParams',
				'$filter',
				'$routeParams',
				function($scope, $http, usersService, Appswitcher, $timeout, $rootScope, $window, ngTableParams, $filter, $routeParams) {
					
					
					// Menus
					Appswitcher.getApps();
					$rootScope.nav = {toolbar: [], menus: []}; //reset
					$rootScope.nav.brand = 'FNLF Brukere';

					
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
					

					



							
							$scope.usersTable = new ngTableParams({
						        page: 1,            // show first page
						        count: 10,           // count per page
						        sorting: {
						            _created: 'desc'     // initial sorting
						        }
						    }, {
						        total: $scope.users.length, // length of data
						        getData: function($defer, params) {



										var page = params.page();
										var count = params.count();

										var sortString = "-_created";
										angular.forEach(params.sorting(), function (v, k) {
											if (v == 'desc') {
												sortString = '-' + k;
											}
											if (v == 'asc') {
												sortString = k;
											}

										});

										params.settings({ counts:  [20, 50, 100]});
										usersService.getAllUsers(page,count,sortString).then(function(r) {
											$scope.users = r._items;
   											$defer.resolve($scope.users);
											var meta = r._meta;
											params.total(meta.total);
										});




						        },
						        $scope: $scope
						    });

					
					


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
					
					this.getAllUsers = function(page,count,sorting) {
						console.log(page);
						console.log(count);
						console.log(sorting);
						var request = $http({
							method : "get",
							url : urlBase + '/users/?page='+page+'&max_results='+count+'&sort='+sorting,
							
						});
						return (request.then(handleSuccess, handleError));
					};
					
					

					function handleError(response) {
						console.log(response);
						if (!angular.isObject(response.data)
								|| !response.data.message) {
							return ($q.reject("An unknown error occurred."));
						}
						// Otherwise, use expected error message.
						return ($q.reject(response.data.message));
					}
					function handleSuccess(response) {
						return (response.data);
					}

				} ]);