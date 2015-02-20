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
				
//				We already have an interceptor!!!!
//				$httpProvider.interceptors.push(function ($q, $rootScope, $location) {
//						return {
//							'responseError': function (rejection) {
//								var status = rejection.status;
//								var config = rejection.config;
//								var method = config.method;
//								var url = config.url;
//
//								if (status == 401) {
//									$location.path("/");
//								}
//								if (status == 403) {
//									$rootScope.error = "Dont even try. You dont have the necessary roles to acces these datas!!";
//									console.log($rootScope.error);
//								}
//								else {
//									$rootScope.error = method + " on " + url + " failed with status " + status;
//
//								}
//
//								return $q.reject(rejection);
//							}
//						};
//					}
//				);


			}]
	);
})();