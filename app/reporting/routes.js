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
						templateUrl: 'components/observation/1.html',
						controller: 'ObservationController'
					})
					.when('/observation/:id/:ui', {
						templateUrl: 'components/observation/2.html',
						controller: 'ObservationController'
					})
					.when('/observation/modal-route', {
					})
					.when('/report/1', {
						templateUrl: 'components/report/1.html',
						controller: 'ReportController'

					})
					.when('/report/2', {
						templateUrl: 'components/report/2.html',
						controller: 'ReportController'
					})
					.when('/report/3', {
						templateUrl: 'components/report/3.html',
						controller: 'ReportController'

					})
					.when('/report/', {
						templateUrl: 'components/report/1.html',
						controller: 'ReportController'
					})

					.otherwise({redirectTo: '/'});

				$locationProvider.hashPrefix('!');
				

			}]
	);
})();