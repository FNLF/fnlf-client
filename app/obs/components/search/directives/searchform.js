(function () {


	angular.module('reportingApp').directive('searchform', function (RestService, Functions, $location, SearchService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/components/search/directives/searchform.html";

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

				var path = '/search/tag/' + encodeURIComponent(Functions.capitalizeFirstLetter(text)+filterString);
				$location.path(path);
			};

		};

		return directive;
	});


	angular.module('reportingApp').directive('flagsearch', function (RestService, Functions, $location, Definitions) {
		var directive = {};

		directive.restrict = 'E';
		directive.template = '<flags attributes = "all"></flags>';

		directive.scope = {};

		directive.link = function ($scope, element, attrs) {
			$scope.all = {};
			angular.forEach(Definitions.getComponentAttributes(), function (a) {
				$scope.all[a.attribute] = true;
			});
		};

		return directive;
	});


	angular.module('reportingApp').directive('searchformadvanced', function (RestService, Functions, $location, SearchService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/shared/directives/searchformadvanced.html";

		directive.scope = {
			model: '='

		};


		directive.link = function ($scope, element, attrs) {

			if (!$scope.model) {
				$scope.model = {};

			}

			var unbind = $scope.$watch('query', function () {
				if ($scope.query) {
					$scope.model.search.push($scope.query);
					unbind();
				}
			});


			var getTags = function (groups) {
				return RestService.getMostPopularTags(groups)
					.then(function (data) {
						return Functions.deduplicate(data._items
							.map(function (t) {
								return Functions.capitalizeFirstLetter(t.tag);
							}));
					});
			};

			$scope.tags = [];
			getTags(SearchService.getObservationTagGroups())
				.then(function (data) {
					$scope.tags = data;
				});


			$scope.whatTags = [];
			getTags(SearchService.getWhatTagGroups())
				.then(function (data) {
					$scope.whatTags = data;
				});

			$scope.gearTags = [];
			getTags(SearchService.getGearTagGroups())
				.then(function (data) {
					$scope.gearTags = data;
				});


			$scope.atTags = [];
			getTags(SearchService.getAtTagGroups())
				.then(function (data) {
					$scope.atTags = data;
				});


			$scope.refresh = function (search) {

				$scope.model.text = Functions.capitalizeFirstLetter(search);


			};

			$scope.onSelect = function (tag) {

			};

			$scope.searchDisabled = function () {

				return ($scope.model.what.length + $scope.model.gear.length + $scope.model.at+ $scope.model.jumps) == 0;
			};

			$scope.go = function () {
				SearchService.goSearchAdvanced($scope.model);

			};

		};

		return directive;
	});


})();