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
					$location.path("/observation/"+item.id);
				});

			};

			$scope.createObservation = function(){
				console.log("Create");
				
				var club = $scope.observation.club;
				console.log($scope.observation.when);
				$scope.observation.club = club.id;
				//if(club.ci) $scope.observation.organization.ci = club.ci;
				//if(club.ot) $scope.observation.organization.ot = club.ot;
				
				//To be filled in!
				/**
				$scope.observation.organization.plane = '';
				$scope.observation.organization.hm = '';
				$scope.observation.organization.hl = '';
				$scope.observation.organization.hfl = [];
				**/
				
				console.log($scope.observation);
				RestService.createObservation($scope.observation).success(function(metadata){
					console.log("Save");
					RestService.getObservation(metadata._id).success(function(item){
						console.log(item);
						$scope.observation = item;
						console.log("Set");
						$location.path("/observation/"+item.id);
					});

				});


			};

			$scope.getObservations = function(){
				var userName = $rootScope.username;
				RestService.getObservations(userName)
					.success(function(data){
						$scope.observations = data._items;
					});

			};


			$scope.goToPage = function (url) {
				$location.path(url);
			};
		});

})();