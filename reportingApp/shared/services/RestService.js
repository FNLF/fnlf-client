(function(){

angular.module('reportingApp')
	.service('RestService', ['$http', function($http) {
        var urlBase = '/api/v1';

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
            return $http.get(urlBase + '/melwin');
        };
        this.getPersons = function() {
            return $http.get(urlBase + '/melwin');
            return $http.get(urlBase + '/melwin');
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

})();