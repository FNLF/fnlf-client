(function () {
	var aclApp = angular.module('aclApp');
	
	aclApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
			function ($routeProvider, $locationProvider, $httpProvider) {
				$routeProvider
					.when('/', {
						templateUrl: 'partials/main.html',
						controller: 'aclController'
					})
					.when('/group/:groupid', {
						templateUrl: 'partials/group.html',
						controller: 'aclController'
					})
					.when('/group/:groupid/role/:roleid', {
						templateUrl: 'partials/role.html',
						controller: 'aclController'
					});

				$locationProvider.hashPrefix('!');

			}]
	);
})();