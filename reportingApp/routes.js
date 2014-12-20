(function(){
var reportingApp = angular.module('reportingApp');
reportingApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
                .when('/', {
                    templateUrl: 'reportingApp/components/login/startPage.html',
                    controller: 'LoginController'
                })
                .when('/report/1', {
                    templateUrl: 'reportingApp/components/report/1.html',
                    controller: 'ReportController'

                })
                .when('/report/2', {
                    templateUrl: 'reportingApp/components/report/2.html',
                    controller: 'ReportController'
                })
                .when('/report/3', {
                    templateUrl: 'reportingApp/components/report/3.html',
                    controller: 'ReportController'

                })
                .when('/report/', {
                    templateUrl: 'reportingApp/components/report/1.html',
                    controller: 'ReportController'
                })

                .otherwise({redirectTo: '/'});

        $locationProvider.hashPrefix('!');
		    $httpProvider.interceptors.push(function ($q, $rootScope, $location) {
			        return {
			        	'responseError': function(rejection) {
			        		var status = rejection.status;
			        		var config = rejection.config;
			        		var method = config.method;
			        		var url = config.url;

			        		if (status == 401) {
			        			$location.path( "/login" );
			        		}
							if (status == 403)  {
								$rootScope.error = "Dont even try. You dont have the necessary roles to acces these datas!!";
								console.log($rootScope.error);
							}
							else {
								$rootScope.error = method + " on " + url + " failed with status " + status;

			        		}

			        		return $q.reject(rejection);
			        	}
			        };
			    }
		    );


		} ]

	);
})();