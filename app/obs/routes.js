(function () {
	var reporting = angular.module('reportingApp');
	reporting.config(['$routeProvider', '$locationProvider', '$httpProvider',
			function ($routeProvider, $locationProvider, $httpProvider) {
				$routeProvider
					.when('/', {
						templateUrl: 'components/main/startPage.html',
						controller: 'MainController'
					})
					.when('/observation/:id', {
						templateUrl: 'components/observation/editor.html',
						controller: 'ObservationController'
					})
					.when('/observation/report/:id', {
						templateUrl: 'components/observation/report.html',
						controller: 'ReportController'

					})
					.when('/observation/:id/:ui', {
						templateUrl: 'components/observation/sandbox.html',
						controller: 'ObservationController'
					})
					.when('/search/tag/:tag', {
						templateUrl: 'components/observation/search.html',
						controller: 'SearchController'
					})
					.when('/search/tag/', {
						templateUrl: 'components/observation/search.html',
						controller: 'SearchController'
					})
					.when('/search/flag/:flag', {
						templateUrl: 'components/observation/search.html',
						controller: 'SearchController'
					})
                    .when('/search/advanced/:q', {
                        templateUrl: 'components/observation/search.html',
                        controller: 'SearchController'
                    })
					.when('/observation/modal-route', {
					})
					.otherwise({redirectTo: '/'});

				$locationProvider.hashPrefix('!');
				

			}]
	);
})();