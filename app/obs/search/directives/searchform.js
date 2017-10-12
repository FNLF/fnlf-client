	angular.module('reportingApp').directive('searchform', function (RestService, Functions, $location, SearchService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/search/directives/searchform.html";

		directive.scope = {
			query: '=',
			filter: '='
		};

		directive.link = function ($scope, element, attrs) {


			$scope.model = {};
			$scope.model.search = '';

			var unbind = $scope.$watch('query', function () {
				if ($scope.query) {
					$scope.model.search = $scope.query;
					unbind();
				}
			});

			var groups = SearchService.getObservationTagGroups();

			$scope.tags = [];


			RestService.getMostPopularTags(groups)
				.then(function (data) {
					$scope.tags = Functions.deduplicate(data._items
						.map(function (t) {
							return Functions.capitalizeFirstLetter(t.tag);
						}));
				});


			$scope.go = function () {
				var text = $scope.model.search;

				var filterString = '';

				var filteredFilter = {};
				if($scope.filter) {
					Object.keys($scope.filter).forEach(function (k) {
						if ($scope.filter[k]) {
							filteredFilter[k] = $scope.filter[k];
						}
					});
				}
				if(Object.keys(filteredFilter).length>0){
					filterString=','+JSON.stringify(filteredFilter);
				}

				var path = '/search/tag/' + Functions.capitalizeFirstLetter(text)+filterString;
				$location.path(path);
			};

		};

		return directive;
	});
