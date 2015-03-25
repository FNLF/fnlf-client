(function () {

	var tagging = function (RestService,Functions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/shared/directives/tagging.html";

		directive.scope = {
			model: '=',
			group: '@',
			noun: '@'
		};

		directive.link = function ($scope, element, attrs) {

			$scope.onSelect = function(item, model){
				RestService.addTag(Functions.capitalizeFirstLetter(item),$scope.group);
			};

			$scope.tags = [];
			RestService.getTags($scope.group)
				.success(function(data){
					$scope.tags = Functions.deduplicate(data._items.map(function(t){return t.tag}));
				});
		};

		return directive;
	};

	angular.module('reportingApp').directive('tagging', tagging);

})();


(function () {

	var populartags = function (RestService,Functions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/shared/directives/populartags.html";

		directive.scope = {
			group: '@',
			noun: '@'
		};

		directive.link = function ($scope, element, attrs) {

			$scope.tags = [];
			RestService.getMostPopularTags($scope.group)
				.success(function(data){
					$scope.tags = Functions.deduplicate(data._items.map(function(t){return t.tag}));
				});


		};

		return directive;
	};

	angular.module('reportingApp').directive('populartags', populartags);

})();