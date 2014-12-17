(function(){
var anomalyApp = angular.module('anomalyApp');
anomalyApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
                .when('/', {
                    templateUrl: 'pages/startPage.html',
                    controller: 'MainController'
                })
                .when('/anomalyMain', {
                    templateUrl: 'pages/anomalyMain.html',
                    controller: 'ReportController'

                })
                .when('/report/1', {
                    templateUrl: 'pages/report/1.html',
                    controller: 'ReportController'

                })
                .when('/report/2', {
                    templateUrl: 'pages/report/2.html',
                    controller: 'ReportController'
                })
                .when('/report/3', {
                    templateUrl: 'pages/report/3.html',
                    controller: 'ReportController'

                })
                .when('/report/4', {
                    templateUrl: 'pages/report/4.html',
                    controller: 'MainController'

                })
                .when('/report/', {
                    templateUrl: 'pages/report/1.html',
                    controller: 'ReportController'

                })
                .when('/admin/1', {
                    templateUrl: 'pages/admin/adminMain.html',
                    controller: 'ReportController'

                })
                .when('/admin/clubs', {
                    templateUrl: 'pages/admin/editClubs.html',
                    controller: 'ClubController'

                })
                .when('/admin/licenses', {
                    templateUrl: 'pages/admin/editLicenses.html',
                    controller: 'ClubController'

                })
                .when('/admin/incidentTypes', {
                    templateUrl: 'pages/admin/editIncidentTypes.html',
                    controller: 'IncidentController'

                })
                .when('/admin/jumpTypes', {
                    templateUrl: 'pages/admin/editJumpTypes.html',
                    controller: 'IncidentController'

                })
                .when('/admin/locations', {
                    templateUrl: 'pages/admin/editLocations.html',
                    controller: 'LocationsController'

                })
                .when('/hi', {
                    templateUrl: 'pages/hi/allAnomalies.html',
                    controller: 'HiController'

                })
                .when('/hi/2', {
                    templateUrl: 'pages/hi/anomalyDetails.html',
                    controller: 'HiController'

                })
                .when('/admin/gear', {
                    templateUrl: 'pages/admin/editGear.html',
                    controller: 'GearController'

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

		    $httpProvider.interceptors.push(function ($q, $rootScope, $location) {
		        return {
		        	'request': function(config) {
		        		var isRestCall = config.url.indexOf('/api/') > -1;
		        		if (isRestCall && angular.isDefined($rootScope.authToken)) {
		        			var authToken = $rootScope.authToken;
		        			if (appConfig.useAuthTokenHeader) {
		        				config.headers['X-Auth-Token'] = authToken;
		        			} else {
		        				config.url = config.url + "?token=" + authToken;
		        			}
		        		}
		        		return config || $q.when(config);
		        	}
		        };
		    }
	    );

		} ]

	);
})();