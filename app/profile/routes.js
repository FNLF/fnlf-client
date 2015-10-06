(function () {
	var profileApp = angular.module('profileApp');
	
	profileApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
			function ($routeProvider, $locationProvider, $httpProvider) {
				$routeProvider
					.when('/', {
						templateUrl: 'partials/main.html',
						controller: 'userController'
					});
				$locationProvider.hashPrefix('!');


			}]
	);
})();