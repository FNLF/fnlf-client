(function () {
	var usersApp = angular.module('usersApp');
	
	usersApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
			function ($routeProvider, $locationProvider, $httpProvider) {
				$routeProvider
					.when('/', {
						templateUrl: 'partials/main.html',
						controller: 'usersLocalController'
					})
					.when('/user/:userid', {
						templateUrl: 'partials/user.html',
						controller: 'usersLocalController'
					});

				$locationProvider.hashPrefix('!');

			}]
	);
})();