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
		.controller('MainController', function ($scope,$rootScope,ObservationService,RestService,$location) {


			$scope.observation = {when:new Date()};
			$scope.observations = {};

			$scope.editObservation = function(_id){
				console.log("Edit");
				RestService.getObservation(_id).success(function(item){
					console.log(item);
					$scope.observation = item;
					ObservationService.setObservation($scope.observation);
					console.log("Set");
					$location.path("/observation/1");
				});

			};

			$scope.createObservation = function(){
				console.log("Create");
				RestService.createObservation($scope.observation).success(function(metadata){
					console.log("Save");
					RestService.getObservation(metadata._id).success(function(item){
						console.log(item);
						$scope.observation = item;
						ObservationService.setObservation($scope.observation);
						console.log("Set");
						$location.path("/observation/1");
					});

				});


			};

			$scope.getObservations = function(){
				RestService.getObservations()
					.success(function(data){
						$scope.observations = data._items;
						angular.forEach($scope.observations,function(obs){
							ObservationService.setTitle(obs);
						});

					});

			};


			$scope.goToPage = function (url) {
				$location.path(url);
			};
		});

})();