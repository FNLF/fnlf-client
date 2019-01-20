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
				SearchService.go(text,$scope.filter);
			};

			$scope.saveJSON = function () {
				$scope.toJSON = '';
				$scope.toJSON = angular.toJson(SearchService.getTableData());
				var blob = new Blob([$scope.toJSON], { type:"application/json;charset=utf-8;" });			
				var downloadLink = angular.element('<a></a>');
							downloadLink.attr('href',window.URL.createObjectURL(blob));
							downloadLink.attr('download', 'fileName.json');
				downloadLink[0].click();
			};

		};

		return directive;
	});
