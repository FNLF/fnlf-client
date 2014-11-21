/**
*
* @author: Tore Buer, s180346
* @author: Eivind Jacobsen, s173466
* @author: Morten Kristoffersen, s169440
*
* @since may.26.2014
*
*/
var anomalyApp = angular.module('anomalyApp', [
    'ngRoute',
    'ngResource',
    'ui',
    'ngCookies',
    'anomalyApp.services',
    'angular-loading-bar'
]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = true;
}]);

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
		        		var isRestCall = config.url.indexOf('https://nlf-az-db02.cloudapp.net/api/') == 0;
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

anomalyApp.service('RestService', ['$http', function($http) {
        var urlBase = 'https://nlf-az-db02.cloudapp.net/api';

        var persons = {};
        var licenses = {};
        getLicenses();

        //Club data
        this.saveClub = function(club) {
            return $http.post(urlBase + '/clubs', club);
        };
        this.getClubs = function() {
            return $http.get(urlBase + "/clubs");
        };
        this.updateClub = function(club) {
            return $http.put(urlBase + '/clubs', club);
            //return RestFactory.updateClub(club);
        };
        this.deleteClub = function(club) {
            return $http.delete(urlBase + '/clubs/' + club.id);
        };

        //Location Data
        this.saveLocation = function(location) {
            return $http.post(urlBase + '/locations', location);
        };
        this.getLocations = function() {
            return $http.get(urlBase + "/locations");
        };
        this.updateLocation = function(location) {
            return $http.put(urlBase + '/locations/' + location.id, location);
        };
        this.deleteLocation = function(location) {
            return $http.delete(urlBase + '/locations/' + location.id);
        };

        //License Data
        this.saveLicense = function(license) {
            return $http.post(urlBase + '/licenses', license);
        };
        this.getLicenses = function() {
            return licenses;
        };
        function getLicenses() {
            licenses =  [
    {
        "id": 1,
        "melwinId": "F-P",
        "licenseName": "Fallskjermpakkerlisens",
        "active": true
    },
    {
        "id": 2,
        "melwinId": "F-MK",
        "licenseName": "Materiellkontrollør",
        "active": true
    },
    {
        "id": 3,
        "melwinId": "F-MR",
        "licenseName": "Materiellreperatør",
        "active": true
    },
    {
        "id": 4,
        "melwinId": "E",
        "licenseName": "Elevbevis line",
        "active": true
    },
    {
        "id": 5,
        "melwinId": "F-EF",
        "licenseName": "Elevbevis fritt fall",
        "active": true
    },
    {
        "id": 6,
        "melwinId": "F-EA",
        "licenseName": "Elevbevis AFF",
        "active": true
    },
    {
        "id": 7,
        "melwinId": "F-A",
        "licenseName": "A-lisens",
        "active": true
    },
    {
        "id": 8,
        "melwinId": "F-B",
        "licenseName": "B-lisens",
        "active": true
    },
    {
        "id": 9,
        "melwinId": "F-C",
        "licenseName": "C-lisens",
        "active": true
    },
    {
        "id": 10,
        "melwinId": "F-D",
        "licenseName": "D-lisens",
        "active": true
    },
    {
        "id": 11,
        "melwinId": "F-TV",
        "licenseName": "Videolisens tandem",
        "active": true
    },
    {
        "id": 12,
        "melwinId": "F-DM2",
        "licenseName": "Demolisens 2",
        "active": true
    },
    {
        "id": 13,
        "melwinId": "F-DM1",
        "licenseName": "Demolisens 1",
        "active": true
    },
    {
        "id": 14,
        "melwinId": "F-TD",
        "licenseName": "Demolisens tandem",
        "active": true
    },
    {
        "id": 15,
        "melwinId": "TOM",
        "licenseName": "Tandemelev",
        "active": true
    },
    {
        "id": 16,
        "melwinId": "F-I3",
        "licenseName": "Instruktør 3",
        "active": true
    },
    {
        "id": 17,
        "melwinId": "F-I2",
        "licenseName": "Instruktør 2",
        "active": true
    },
    {
        "id": 18,
        "melwinId": "F-I1",
        "licenseName": "Instruktør 1",
        "active": true
    },
    {
        "id": 19,
        "melwinId": "F-T",
        "licenseName": "Instruktør tandem",
        "active": true
    },
    {
        "id": 20,
        "melwinId": "F-ITE",
        "licenseName": "Instruktør eksaminator tandem",
        "active": true
    },
    {
        "id": 21,
        "melwinId": "F-I2AFF",
        "licenseName": "Instruktør2 aff",
        "active": true
    },
    {
        "id": 22,
        "melwinId": "F-I3AFF",
        "licenseName": "Instruktør3 aff",
        "active": true
    },
    {
        "id": 23,
        "melwinId": "F-IAE",
        "licenseName": "Instruktør eksaminator aff",
        "active": true
    },
    {
        "id": 24,
        "melwinId": "F-IE",
        "licenseName": "Instruktør eksaminator",
        "active": true
    }
];
        };
        this.updateLicense = function(license) {
            return $http.put(urlBase + '/licenses/' + license.id, license);
        };
        this.deleteLicense = function(license) {
            return $http.delete(urlBase + '/licenses/' + license.melwinId);
        };

        //JumpType Data
        this.saveJumpType = function(jumpType) {
            return $http.post(urlBase + '/jumptypes', jumpType);
        };
        this.getJumpTypes = function() {
            var jumptypes = $http.get(urlBase + "/jumptypes");
            return jumptypes;
        };
        this.updateJumpType = function(jumpType) {
            return $http.put(urlBase + '/jumptypes/' + jumpType.id, jumpType);
        }; 
        this.deleteJumpType = function(jumpType) {
            return $http.delete(urlBase + '/jumptypes/' + jumpType.id);
        };

        //Person Data
        this.savePerson = function(newPerson) {
            var nyperson = $http.post(urlBase + '/persons/', newPerson);
            return nyperson;
        };
        function getPersonsFromDb() {
            return $http.get(urlBase + '/persons');
        };
        this.getPersons = function() {
            return $http.get(urlBase + '/persons');
        };
        this.updatePerson = function(person) {
            return $http.put(urlBase + '/persons/' + person.melwinId, person);
        };
        this.deletePerson = function(person) {
            return $http.delete(urlBase + '/persons/' + person.melwinId);
        };
        this.getPerson = function(melwinId){
            $http.get(urlBase + '/nlfparachutist/' + melwinId)
                    .success(function(person){
                        return person;
            });
        };

        //Incident Data
        this.saveIncident = function(incident) {
            return $http.post(urlBase + '/incidents', incident);
        };
        this.getIncidents = function() {
            return $http.get(urlBase + "/incidents");
        };
        this.updateIncident = function(incident) {
            return $http.put(urlBase + '/incidents/' + incident.timelineIndex, incident);
        };
        this.deleteIncident = function(incident) {
            return $http.delete(urlBase + '/incidents/' + incident.timelineIndex);
        };

        //Anomaly Data
        this.saveAnomaly = function(anomaly) {
                return $http.post(urlBase + '/anomalies', anomaly);
        };
        this.getAnomalies = function() {
            return $http.get(urlBase + '/anomalies');
        };
        this.updateAnomaly = function(anomaly) {
            return $http.put(urlBase + '/anomalies/' + anomaly.id, anomaly);
        };
        this.deleteAnomaly = function(anomaly) {
            return $http.delete(urlBase + '/anomalies/' + anomaly.id);
        };

        //Anomalystypes Data
        this.saveAnomalyType = function(anomalyType) {
            return $http.post(urlBase + '/anomalytypes', anomalyType);
        };
        this.getAnomalyTypes = function() {
            return $http.get(urlBase + "/anomalytypes");
        };
        this.updateAnomalyType = function(anomalyType) {
            return $http.put(urlBase + '/anomalytypes/' + anomalyType.id, anomalyType);
        };
        this.deleteAnomalyType = function(anomalyType) {
            return $http.delete(urlBase + '/anomalytypes/' + anomalyType.id);
        };

        //AnomalyStatus Data
        this.saveAnomalyStatus = function(anomalyStatus) {
            return $http.post(urlBase + '/anomalystatuses', anomalyStatus);
        };
        function getAnomalyStatuses() {
            return $http.get(urlBase + '/anomalystatuses/');
        };
        this.findAnomalyStatus = function(id) {
            return $http.get(urlBase + '/anomalystatuses/' + id);
        };
        this.updateAnomalyStatus = function(anomalyStatus) {
            return $http.put(urlBase + '/anomalystatuses/' + anomalyStatus.id, anomalyStatus);
        };
        this.deleteAnomalyStatus = function(anomalyStatus) {
            return $http.delete(urlBase + '/anomalystatuses/' + anomalyStatus.id);
        };

        //IncidentTypes
        this.getIncidentTypes = function() {
            return $http.get(urlBase + '/incidenttypes/');
        };
        this.saveIncidentType = function(incidentType) {
            return $http.post(urlBase + '/incidenttypes/', incidentType);
        };
        this.updateIncidentType = function(incidentType) {
            return $http.put(urlBase + '/incidenttypes/' + incidentType.id, incidentType);
        };
        this.deleteIncidentType = function(id) {
            return $http.delete(urlBase + '/incidenttypes/' + id);
        };

        //GEAR
        //ManufacturerData
        this.getManufacturers = function() {
            return $http.get(urlBase + '/manufacturers/');
        };
        this.getManufacturer = function(id) {
            return $http.get(urlBase + '/manufacturers/' + id)
        };
        this.saveManufacturer = function(manufacturer) {
            return $http.post(urlBase + '/manufacturers/', manufacturer);
        };
        this.updateManufacturer = function(manufacturer) {
            return $http.put(urlBase + '/manufacturers/', manufacturer);
        };
        this.deleteManufacturer = function(id) {
            var retur = $http.delete(urlBase + '/manufacturers/' + id);
        };

        //MainCanopy Data
        this.getMainCanopies = function() {
            return $http.get(urlBase + '/maincanopies/');
        };
        this.getMainCanopy = function(id) {
            return $http.get(urlBase + '/maincanopies/' + id)
        };
        this.saveMainCanopy = function(mainCanopy) {
            return $http.post(urlBase + '/maincanopies/', mainCanopy);
        };
        this.updateMainCanopy = function(mainCanopy) {
            return $http.put(urlBase + '/maincanopies/', mainCanopy);
        };
        this.deleteMainCanopy = function(id) {
            return $http.delete(urlBase + '/maincanopies/' + id);
        };
    }]);

anomalyApp.service('DataService', function(RestService) {
    var anomaly = {};
    var licensesFromMelwin = RestService.getLicenses();
    
    this.getLicensesFromMelwin = function(){
        return licensesFromMelwin;
    };

    this.setSelectedAnomaly = function(anomalySelected) {
        anomaly = anomalySelected;
    };
    this.getSelectedAnomaly = function() {
        return anomaly;
    };
    this.resetSelectedAnomaly = function() {
        var anomaly = {};
    };

    this.createAnomaly = function(anomalyObject) {
        anomaly = anomalyObject;
        var anomalyFromDb;
        anomaly.anomalystatus = RestService.findAnomalyStatus(1);
        RestService.findAnomalyStatus(1)
                .success(function(status) {
                    anomaly.anomalystatus = status;
                    anomalyFromDb = RestService.saveAnomaly(anomaly);
                })
                .error(function(error) {
                });
        return anomalyFromDb;
    };
    this.readAnomaly = function() {
        return anomaly;
    };
    this.saveAnomaly = function(anomaly){
      anomaly = RestService.saveAnomaly(anomaly);  
    };
    this.updateAnomaly = function(anomalyObject) {
        RestService.updateAnomaly(anomaly);
    };
    this.deleteAnomaly = function() {
        anomaly = {};
    };
    this.getAnomalyType = function() {
        if (anomaly.anomalyType == null) 
            return {};
        return anomaly.anomalyType;
    };
    this.setAnomalyType = function(anomalyType) {
        anomaly.anomalyType = anomalyType;
    };
    this.getAnomalyClub = function() {
        if (anomaly.club == null)
            return {};
        return anomaly.club;
    };
    this.setAnomalyClub = function(club) {
        anomaly.club = club;
    };
    this.getLocation = function() {
        if (anomaly.location == null)
            return {};
        return anomaly.location;
    };
    this.setLocation = function(location) {
        anomaly.location = location;
    };
    this.getDateTime = function() {
        if (anomaly.dateTime == null)
            anomaly.dateTime = "";
        return anomaly.dateTime.toLocaleString();
    };
    this.setDateTime = function(date) {
        anomaly.dateTime = date;
    };
    this.getPersonsInvolvedInAnomaly = function() {
        if (anomaly.involvedPersons == null)
            return [];
        return anomaly.involvedPersons;
    };
    this.setPersonsInvolvedInAnomaly = function(persons) {
        anomaly.involvedPersons = persons;
    };
    this.getPersonInvolvedById = function(id) {
        for (var i = 0; i < anomaly.involvedPersons.length; i++) {
            if (anomaly.involvedPersons[i].id == id) {
                return anomaly.involvedPersons[i];
            }
            return null;
        }
    };
    this.setJumpType = function(jumpType) {
        anomaly.involvedPersons.jumpType = jumpType;
    };
    this.getJumpType = function() {

    };
    this.addIncident = function(incident) {
        if (anomaly.incidents == null) { 
            anomaly.incidents = new Array();
        }
        if (incident.timelineIndex == null) { 
            incident.timelineIndex = anomaly.incidents.length + 1;
            anomaly.incidents.push(incident); 
        }
        else { 
            for (var i in anomaly.incidents) {
                if (anomaly.incidents[i].timelineIndex == incident.timelineIndex) {
                    anomaly.incidents[i] = incident;
                }
            }
        }
    };
    this.deleteIncident = function(timelineIndex) {
        for (var i in anomaly.incidents) {
            if (anomaly.incidents[i].timelineIndex == timelineIndex) {
                anomaly.incidents.splice(i, 1);
            }
            editIncidentIds();
        }
    };
    editIncidentIds = function() {
        var id = 1;
        for (var i in anomaly.incidents) {
            anomaly.incidents[i].timelineIndex = id++;
        }
    };
    this.moveIncidentDown = function(timelineIndex) {
        var index = timelineIndex - 1;
        if (timelineIndex < anomaly.incidents.length) {
            var temp = anomaly.incidents[index];
            anomaly.incidents[index] = anomaly.incidents[index + 1];
            anomaly.incidents[index + 1] = temp;
        }
        editIncidentIds();
    };
    this.moveIncidentUp = function(timelineIndex) {
        var index = timelineIndex - 1;
        if (index > 0) {
            var temp = anomaly.incidents[index];
            anomaly.incidents[index] = anomaly.incidents[index - 1];
            anomaly.incidents[index - 1] = temp;
        }
        editIncidentIds();
    };
    this.getIncidentByTimelineIndex = function(timelineIndex) {
        for (var i in anomaly.incidents) {
            if (anomaly.incidents[i].timelineIndex == timelineIndex) {
                return anomaly.incidents[i];
            }
        }
        return null;
    };

    this.saveManufacturer = function(manufacturer) {
        var newManufacturer;
        RestService.createManufacturer(manufacturer)
                .success(function(manufacturer) {
                    newManufacturer = manufacturer;
                })
                .error(function(error) {
                    //Handle error
                });

        return newManufacturer;
    };
    this.getManufacturer = function(id) {
        var manufacturer;
        RestService.getManufacturer(id)
                .success(function(m) {
                    manufacturer = m;
                })
                .error(function(error) {
                    //Handle error
                });
        return manufacturer;
    };
    this.getManufacturers = function() {
        var manufacturers;
        RestService.getManufacturers()
                .success(function(m) {
                    manufacturers = m;
                })
                .error(function(error) {
                    //Handle error;
                });
        return manufacturers;
    };
    this.updateManufacturer = function() {
        RestService.updateManufacturer;
    };
    this.deleteAnomaly = function() {
        anomaly = {};
    };
});

anomalyApp.run(function($rootScope, $location, $cookieStore, UserService) {
		
		$rootScope.$on('$viewContentLoaded', function() {
			delete $rootScope.error;
		});
		
		$rootScope.hasRole = function(role) {	
			if ($rootScope.user === undefined) {
				return false;
			}
			if ($rootScope.user.roles[role] === undefined) {
				return false;
			}
			return $rootScope.user.roles[role];
		};
		
		$rootScope.logout = function() {
			delete $rootScope.user;
			delete $rootScope.authToken;
                        $cookieStore.remove('authToken');
			$location.path("/login");
                        if(!$rootScope.rememberMe){
                            $cookieStore.remove('username');
                            $cookieStore.remove('password');
                            $cookieStore.remove('rememberMe');
                        }
		};
		
		 /* Try getting an authenticated user from cookie or go to login page */
		var originalPath = $location.path();
		$location.path("/");
		var authToken = $cookieStore.get('authToken');
		if (authToken !== undefined) {
			$rootScope.authToken = authToken;
			UserService.get(function(user) {
				$rootScope.user = user;
				$location.path(originalPath);
			});
		}
		
		$rootScope.initialized = true;
	});

function LoginController($scope, $rootScope, $location, $cookieStore, UserService) {
	
	$scope.rememberMe = $cookieStore.get('rememberMe');
        $scope.username = $cookieStore.get('username');
        $scope.password = $cookieStore.get('password');
	
	$scope.login = function() {
		UserService.authenticate($.param({username: $scope.username, password: $scope.password}), function(authenticationResult) {
			var authToken = authenticationResult.token;
			$rootScope.authToken = authToken;
                        
			if ($scope.rememberMe) {
                            $rootScope.rememberMe = true;
				$cookieStore.put('authToken', authToken);
				$cookieStore.put('username', $scope.username);
				$cookieStore.put('password', $scope.password);
				$cookieStore.put('rememberMe', $scope.rememberMe);
			}
			UserService.get(function(user) {
				$rootScope.user = user;
				$location.path("/");
			});
		});
	};

};

var services = angular.module('anomalyApp.services', ['ngResource']);

services.factory('UserService', function($resource) {	
	return $resource('https://nlf-az-db02.cloudapp.net/api/user/:action', {},
			{
				authenticate: {
					method: 'POST',
					params: {'action' : 'authenticate'},
					headers : {'Content-Type': 'application/x-www-form-urlencoded'}
				}
			}
		);
});
