(function() {

	var aclApp = angular.module('aclApp', [ 'ngRoute', 'ui.bootstrap',
			'ui.select', 'ngSanitize', 'ngCookies', 'angular-loading-bar',
			'fnlf-login', 'resolve', 'ngTable' ]);

	aclApp.config([ 'cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeBar = true;
		cfpLoadingBarProvider.includeSpinner = true;
	} ]);

})();

angular.module("aclApp").controller("aclController",[
				'$scope',
				'$http',
				'aclService',
				'$timeout',
				'$rootScope',
				'$window',
				'ngTableParams',
				'$filter',
				'$routeParams',
				function($scope, $http, aclService, $timeout, $rootScope, $window, ngTableParams, $filter, $routeParams) {
					
					if($routeParams.groupid) $scope.groupId = $routeParams.groupid;
					if($routeParams.roleid) $scope.roleId = $routeParams.roleid;
					
					var urlBase = '/api/v1';
					$scope.group = {};
					
					$scope.grouppersons = [];
					$scope.personsFromDb = [];
					
					function ArrNoDupe(a) {
					    var temp = {};
					    for (var i = 0; i < a.length; i++)
					        temp[a[i]] = true;
					    var r = [];
					    for (var k in temp)
					        r.push(k);
					    return r;
					}
					
					$scope.getPersonsByName = function (name) {
						aclService.getUserByName(name)
						.success(function (response) {
							$scope.personsFromDb = response._items;
							console.log($scope.personsFromDb);
						});
					};
					
					$scope.getPersonsInGroup = function() {
						
						aclService.getPersonsInGroup($scope.group._id).then(function(r) {
							
							$scope.grouppersons = r._items;
						});
					};
				
					// GROUP
					$scope.getGroup = function() {
						aclService.getGroup($scope.groupId).then(function(r){
							$scope.group = r;
							$scope.getPersonsInGroup();
							$scope.getAllRoles();
						});
					};
					
					$scope.createGroup = function() {
						
						aclService.createGroup($scope.group).then(function(r) {
							
							$scope.group = {};
							$scope.getAllGroups();
						});
					};
					
					$scope.onSelectGroup=function(item,model) {
						aclService.addUserGroup(item.id, $scope.group._id).then(function(r) {
							
							if(r.nModified == 0) {
								//do something
								$scope.error = "Kunne ikke legge til " + item.fullname + " vedkommende har aldri logget på";
							}
							
						});
						
						
					};
					$scope.onRemovedGroup=function(item,model) {
						aclService.deleteUserGroup(item.id, $scope.group._id).then(function(r) {
							
						});
						
					};
					$scope.onSelectRole = function(item, model, role) {
						aclService.addUserRole(item.id, role).then(function(r) {
							
							if(r.nModified == 0) {
								//do something
								$scope.error = "Kunne ikke legge til " + item.fullname + " vedkommende har aldri logget på";
							}
							
						});
					};
					$scope.onRemovedRole = function(item, model, role) {
						
						aclService.deleteUserRole(item.id, role).then(function(r) {
							
						});
					};
					
					$scope.getAllGroups = function() {
						aclService.getAllGroups().then(function(r) {
							
							$scope.groups = r._items;
							
							$scope.groupsTable = new ngTableParams({
						        page: 1,            // show first page
						        count: 10,           // count per page
						        sorting: {
						            name: 'asc'     // initial sorting
						        }
						    }, {
						        total: $scope.groups.length, // length of data
						        getData: function($defer, params) {
						        	var filteredData = params.filter() ? $filter('filter')($scope.groups, params.filter()) : $scope.groups;
						            var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
						            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
						        },
						        $scope: $scope
						    });
						});
					};
					
					
					// Roles
					$scope.createRole = function() {
						console.log($scope.role);
						$scope.role.group =$scope.group._id;
						aclService.createRole($scope.role).then(function(r) {
							
							$scope.role = {};
							//$scope.getAllRoles();
						});
					};
					
					$scope.getAllRoles = function() {
						
						aclService.getAllRoles($scope.group._id).then(function(r) {
							$scope.roles = r._items;
						});
					};
					
					$scope.getRole = function() {
						aclService.getRole($scope.roleId).then(function(r){
							$scope.role = r;
							$scope.getPersonsInRole($scope.role);
							
							aclService.getGroup($scope.groupId).then(function(r){
								$scope.group = r;
							});
							
						});
					};
					
					$scope.getPersonsInRole = function() {
						console.log("Getting thos roles");
						console.log($scope.roleId);
						aclService.getPersonsInRole($scope.roleId).then(function(r) {
							$scope.rolepersons = r._items;
						});
					};
					


				} ]);

angular.module("aclApp").service("aclService",['$http',	'$q', '$rootScope', function($http, $q, $rootScope) {

					var urlBase = '/api/v1';
					
					this.getUserByName = function (name) {
						return $http.get(urlBase + '/melwin/users/search?q=' + name);
					};
					
					this.getUserById = function(username) {
						var request = $http({
							method : "get",
							url : urlBase + '/users/' + username,
							
						});
						return (request.then(handleSuccess, handleError));
					};
					
					this.getAllGroups = function() {

						var request = $http({
							method : "get",
							url : urlBase + '/acl/groups/?max_results=1000',
							
						});
						return (request.then(handleSuccess, handleError));

					};
					this.getPersonsInGroup = function(groupid) {
						
						var request = $http({
							method : "get",
							url : urlBase + '/users/acl/?where={"acl.groups": {"$in": ["'+groupid+'"]}}',
							
						});
						return (request.then(handleSuccess, handleError));
						
					};
					this.getGroup = function(objectid) {
						
						var request = $http({
							method : "get",
							url : urlBase + '/acl/groups/'+objectid,
							
						});
						return (request.then(handleSuccess, handleError));
						
					};
					
					this.createGroup = function(group) {
						
						//Should have a test! if($scope.groups.indexOf(group.name))
						var request = $http({
							method : "post",
							url : urlBase + '/acl/groups/',
							headers: {'Content-Type': 'application/json'},
							data: {name: group.name, description: group.description, ref: group.ref},
						});
						return (request.then(handleSuccess, handleError));
						
					};
					
					this.getRole = function(objectid) {
						
						var request = $http({
							method : "get",
							url : urlBase + '/acl/roles/'+objectid,
							
						});
						return (request.then(handleSuccess, handleError));
					};
					
					this.getAllRoles = function(groupid) {
						
						var request = $http({
							method : "get",
							url : urlBase + '/acl/roles/?where={"group":"'+groupid+'"}',
							
						});
						return (request.then(handleSuccess, handleError));
					};
					
					this.createRole = function(role) {
						
						//Should have a test! if($scope.groups.indexOf(group.name))
						var request = $http({
							method : "post",
							url : urlBase + '/acl/roles/',
							headers: {'Content-Type': 'application/json'},
							data: {name: role.name, description: role.description, group: role.group, ref: role.ref},
						});
						return (request.then(handleSuccess, handleError));
						
					};
					
					this.getPersonsInRole = function(role) {
						
						var request = $http({
							method : "get",
							url : urlBase + '/users/acl/?where={"acl.roles": {"$in": ["'+role+'"]}}',
							
						});
						return (request.then(handleSuccess, handleError));
						
					};
					
					this.getUserAcl = function(userid) {
						
						var request = $http({
							method : "get",
							url : urlBase + '/users/acl/'+userid,
							
						});
						return (request.then(handleSuccess, handleError));
						
					};
					
					
					this.addUserGroup = function(user, group) {
						
						var request = $http({
							method : "post",
							url : urlBase + '/users/acl/' + user +'/group/' + group,
						});
						return (request.then(handleSuccess, handleError));
					};
					this.deleteUserGroup = function(user, group) {
						
						var request = $http({
							method : "delete",
							url : urlBase + '/users/acl/' + user +'/group/' + group,
						});
						return (request.then(handleSuccess, handleError));
					};
					
					this.addUserRole = function(user, role) {
						
						var request = $http({
							method : "post",
							url : urlBase + '/users/acl/' + user +'/role/' + role,
						});
						return (request.then(handleSuccess, handleError));
					};
					this.deleteUserRole = function(user, role) {
						
						var request = $http({
							method : "delete",
							url : urlBase + '/users/acl/' + user +'/role/' + role,
						});
						return (request.then(handleSuccess, handleError));
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
						if (!angular.isObject(response.data)
								|| !response.data.message) {
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