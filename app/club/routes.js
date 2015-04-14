(function () {
	var profileApp = angular.module('clubApp');
	
	profileApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
			function ($routeProvider, $locationProvider, $httpProvider) {
				$routeProvider
					.when('/', {
						templateUrl: 'partials/main.html',
						controller: 'clubController'
					}).when('/locations', {
						templateUrl: 'partials/locations.html',
						controller: 'locationsController'
					});


				$locationProvider.hashPrefix('!');


			}]
	);
})();