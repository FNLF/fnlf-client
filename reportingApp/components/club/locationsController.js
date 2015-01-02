/**
 *
 * @author: Tore Buer, s180346
 * @author: Eivind Jacobsen, s173466
 * @author: Morten Kristoffersen, s169440
 *
 * @since may.26.2014
 *
 */
(function () {
	angular.module('reportingApp')
		.controller('LocationsController',
		function ($scope, RestService, DataService) {
			$scope.service = DataService;
			$scope.locations = [];
			$scope.locationSelected = DataService.getLocation();

			function getLocations() {
				RestService.getLocations()
					.success(function (response) {
						$scope.locations = response._items;
					})
					.error(function (error) {
						$scope.status = 'Fikk ikke hentet steder fra databasen: ' + error.message;
					});
			}

			getLocations();

			$scope.saveNewLocation = function (newLocation) {
				RestService.saveLocation(newLocation)
					.success(function (location) {
						getLocations();
						newLocation = {};
					})
					.error(function (error) {
						//do something
					});

			};
			$scope.$watch(function () {
				return $scope.locationSelected;
			}, function () {
				for (var i = 0; i < $scope.locations.length; i++) {
					if ($scope.locationSelected.id == $scope.locations[i].id) {
						DataService.setLocation($scope.locations[i]);
					}
				}
				;
			}, true);

			$scope.$watch('service.readAnomaly()', function (newValue) {
				$scope.anomaly = newValue;
			});
		});
})();