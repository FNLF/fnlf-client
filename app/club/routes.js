(function () {
	var profileApp = angular.module('profileApp');
	
	profileApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
			function ($routeProvider, $locationProvider, $httpProvider) {
				$routeProvider
					.when('/', {
						templateUrl: 'startpage.html',
						controller: 'userController'
					})
					.when('/:id', {
						templateUrl: 'profile.html',
						controller: 'userController'
					})
					.when('/melwin', {
						templateUrl: 'melwin.html',
						controller: 'melwinController'
					});

				$locationProvider.hashPrefix('!');


			}]
	);
})();