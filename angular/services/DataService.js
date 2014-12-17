(function(){

angular.module('anomalyApp')
	.service('DataService', function(RestService) {
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


})();