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
		.controller('MainController', function ($scope,$rootScope,ObservationService,RestService,$location, ngTableParams, Definitions) {

			$scope.observations = {};
			$scope.allObservations = {};

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
			
			$scope.getAllObservations = function(){
				var userName = $rootScope.username;
				RestService.getAllObservations()
				.success(function(data){
					$scope.allObservations = data._items;
					
					console.log($scope.allObservations);
					
					$scope.tableParams = new ngTableParams({
				        page: 1,            // show first page
				        count: 5           // count per page
				    }, {
				        total: $scope.allObservations.length, // length of data
				        getData: function($defer, params) {
				            $defer.resolve($scope.allObservations.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				        }
				    }); 
					
				});
				
			};
			
			$scope.goToPage = function (url) {
				$location.path(url);
			};
			
			//ng-table

		    
			
		});

})();