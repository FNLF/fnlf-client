(function () {

	/**
	 *
	 * @author: Tore Buer, s180346
	 * @author: Eivind Jacobsen, s173466
	 * @author: Morten Kristoffersen, s169440
	 *
	 * @since may.26.2014
	 *
	 */
	angular.module('reportingApp')
		.controller('ReportController',
		function ($scope, $location, DataService, RestService) {
			$scope.anomalyType = DataService.getAnomalyType();
			$scope.anomaly = {};
			//$scope.anomaly.involvedPersons = DataService.getPersonsInvolvedInAnomaly();
			$scope.service = DataService;
			$scope.pickDate = DataService.getDateTime();
			$scope.incidents = {};

			//getAnomalyTypes();



			$scope.setDate = function () {
				var day = $scope.pickDate.substring(0, 2);
				var month = $scope.pickDate.substring(3, 5) - 1;
				var year = $scope.pickDate.substring(6, 10);

				var hour = $scope.pickDate.substring(11, 13);
				var minute = $scope.pickDate.substring(14, 16);

				$scope.theDate = new Date(year, month, day, hour, minute);
				DataService.setDateTime($scope.theDate);
			};




			$scope.updateAnomaly = function () {
				RestService.updateAnomaly($scope.anomaly);
				$location.path('/report/3');
			};
			$scope.createNewReport = function (anomaly) {
				RestService.saveAnomaly(anomaly);
				$location.path('/report/2');
			};
			$scope.moveIncidentDown = function (id) {
				DataService.moveIncidentDown(id);
			};
			$scope.moveIncidentUp = function (id) {
				DataService.moveIncidentUp(id);
			};

			function getAnomalyTypes() {
				$scope.anomalyTypes = [];
				RestService.getAnomalyTypes()
					.success(function (anomalyTypes) {
						$scope.anomalyTypes = anomalyTypes;
					})
					.error(function (error) {
						//Handle error
					});
			};
		});

})();