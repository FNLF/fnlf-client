(function () {
	var aclApp = angular.module('editorApp');

	aclApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
			function ($routeProvider, $locationProvider, $httpProvider) {
				$routeProvider
					.when('/', {
						templateUrl: 'partials/main.html',
						controller: 'editorController'
					})
					.when('/tags', {
						templateUrl: 'partials/tags.html',
						controller: 'editorController'
					})
					.when('/templates', {
						templateUrl: 'partials/templates.html',
						controller: 'editorController'
					});

				$locationProvider.hashPrefix('!');

			}]
	);
})();