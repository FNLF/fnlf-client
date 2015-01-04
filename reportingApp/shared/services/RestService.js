(function () {

	angular.module('reportingApp')
		.service('RestService', ['$http', function ($http) {
			var urlBase = '/api/v1';


			this.getClubs = function () {
				return $http.get(urlBase + "/clubs?where={\"active\":true}&max_results=50");
			};



			//Location Data
			this.saveLocation = function (location) {
				return $http.post(urlBase + '/locations', location);
			};
			this.getLocations = function () {
				return $http.get(urlBase + "/locations");
			};
			this.updateLocation = function (location) {
				return $http.put(urlBase + '/locations/' + location.id, location);
			};


			//License Data
			this.getLicenses = function () {
				return $http.get(urlBase + '/licenses');
			};

			//JumpType Data
			this.saveJumpType = function (jumpType) {
				return $http.post(urlBase + '/jumptypes', jumpType);
			};
			this.getJumpTypes = function () {
				var jumptypes = $http.get(urlBase + "/jumptypes");
				return jumptypes;
			};


			//Observation Data
			this.saveObservation = function (observation) {
				return $http.post(urlBase + '/observations', observation);
			};
			this.getObservations = function () {
				return $http.get(urlBase + '/observations');
			};
			this.updateObservation = function (observation) {
				return $http.put(urlBase + '/observations/' + observation.id, observation);
			};


			//GEAR
			//ManufacturerData
			this.getManufacturers = function () {
				return $http.get(urlBase + '/manufacturers/');
			};
			this.getManufacturer = function (id) {
				return $http.get(urlBase + '/manufacturers/' + id)
			};
			this.saveManufacturer = function (manufacturer) {
				return $http.post(urlBase + '/manufacturers/', manufacturer);
			};
			this.updateManufacturer = function (manufacturer) {
				return $http.put(urlBase + '/manufacturers/', manufacturer);
			};

			//MainCanopy Data
			this.getMainCanopies = function () {
				return $http.get(urlBase + '/maincanopies/');
			};
			this.getMainCanopy = function (id) {
				return $http.get(urlBase + '/maincanopies/' + id)
			};
			this.saveMainCanopy = function (mainCanopy) {
				return $http.post(urlBase + '/maincanopies/', mainCanopy);
			};
			this.updateMainCanopy = function (mainCanopy) {
				return $http.put(urlBase + '/maincanopies/', mainCanopy);
			};

		}]);

})();