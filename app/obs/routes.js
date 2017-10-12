(function () {
	var reporting = angular.module('reportingApp');
	reporting.config(['$routeProvider', '$locationProvider', '$httpProvider',
			function ($routeProvider, $locationProvider, $httpProvider) {
				$routeProvider
					.when('/', {
						templateUrl: 'main/startPage.html',
						controller: 'MainController'
					})
					.when('/observation/:id', {
						templateUrl: 'observation/editor.html',
						controller: 'ObservationController'
					})
					.when('/observation/report/:id', {
						templateUrl: 'observation/report.html',
						controller: 'ReportController'

					})
					.when('/observation/:id/:ui', {
						templateUrl: 'observation/sandbox.html',
						controller: 'ObservationController'
					})
					.when('/search/query/:rawquery', {
						templateUrl: 'search/search.html',
						controller: 'SearchController'
					})
					.when('/search/tag/:tag', {
						templateUrl: 'search/search.html',
						controller: 'SearchController'
					})
					.when('/search/tag/', {
						templateUrl: 'search/search.html',
						controller: 'SearchController'
					})
					.when('/search/flag/:flag', {
						templateUrl: 'search/search.html',
						controller: 'SearchController'
					})
                    .when('/search/advanced/:query', {
                        templateUrl: 'search/search.html',
                        controller: 'SearchController'
                    })
					.when('/observation/modal-route', {
					})
					.otherwise({redirectTo: '/'});

				$locationProvider.hashPrefix('!');
				

			}]
	);
})();
