(function () {



	angular.module('reportingApp').directive('searchform', function (RestService,Functions,$location) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/shared/directives/searchform.html";

		directive.scope = {

		};

		directive.link = function ($scope, element, attrs) {



			$scope.all = {reserve_ride:true,
				aad_fire:true,
				gear_malfunction:true,
				damage:true,
				gear_failure:true,
				packing_error:true,
				wilfull:true,
				violation:true,
				injury:true,
				death:true
			};


			$scope.model = {};
			$scope.model.search = '';

			var allGroups = ['aadType',
				'aircraftTypes',
				'component.what.cause',
				'component.what.consequence',
				'component.what.incident',
				'harnessTypes',
				'jumptype',
				'maincanopies',
				'observation',
				'otherEquipment',
				'reserveCanopies',
				'where-at'];

			var groups = [
				'component.what.cause',
				'component.what.consequence',
				'component.what.incident',
				'observation',
				'where-at',
				'component'
			];

			$scope.tags = [];
			RestService.getMostPopularTags(groups)
				.then(function(data){
					$scope.tags = Functions.deduplicate(data._items
						.map(function(t){
							return Functions.capitalizeFirstLetter(t.tag);
						}));
				});

			$scope.refresh = function(search){
				if(search) {
					$scope.model.text = Functions.capitalizeFirstLetter(search);
					$scope.model.search = $scope.model.text;
				}
			};

			$scope.onSelect = function(tag){
				console.log(tag);

				if($scope.model.search) {
					var path = '/search/tag/' + $scope.model.search;
					console.log(path);
					$location.path(path);
				}else{
					if($scope.model.text) {
						var path = '/search/tag/' + $scope.model.text;
						console.log(path);
						$location.path(path);
					}

				}
			};

			$scope.go = function(){


				var path = '/search/tag/' + $scope.model.text;
				console.log(path);
				$location.path(path);

			};

		};

		return directive;
	});

})();