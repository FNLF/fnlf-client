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
					.when('/observation/report/:id', {
						templateUrl: 'components/observation/report.html',
						controller: 'ReportController'

					})
					.when('/observation/:id/:ui', {
						templateUrl: 'components/observation/2.html',
						controller: 'ObservationController'
					})
					.when('/observation/modal-route', {
					})
					.otherwise({redirectTo: '/'});

				$locationProvider.hashPrefix('!');
				

			}]
	);
})();