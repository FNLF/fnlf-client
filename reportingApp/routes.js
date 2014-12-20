(function(){
var anomalyApp = angular.module('anomalyApp');
anomalyApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
                .when('/', {
                    templateUrl: 'reportingApp/components/login/startPage.html',
                    controller: 'MainController'
                })
                .when('/report/1', {
                    templateUrl: 'reportingApp/components/report/1.html',
                    controller: 'ReportController'

                })
                .when('/report/2', {
                    templateUrl: 'reportingApp/components/report/report/2.html',
                    controller: 'ReportController'
                })
                .when('/report/3', {
                    templateUrl: 'reportingApp/components/report/report/3.html',
                    controller: 'ReportController'

                })
                .when('/report/4', {
                    templateUrl: 'reportingApp/components/report/report/4.html',
                    controller: 'MainController'

                })
                .when('/report/', {
                    templateUrl: 'reportingApp/components/report/report/1.html',
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