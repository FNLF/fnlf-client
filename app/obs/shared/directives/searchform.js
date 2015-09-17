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



			$scope.searchTag = '';

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
				'where-at'];

			$scope.tags = [];
			RestService.getMostPopularTags(groups)
				.then(function(data){
					$scope.tags = Functions.deduplicate(data._items
						.map(function(t){
							return Functions.capitalizeFirstLetter(t.tag);
						}));
				});


			$scope.onSelect = function(){



				var path = '/search/tag/'+$scope.searchTag;
				console.log(path);
				$location.path(path);
			};

		};

		return directive;
	});

})();