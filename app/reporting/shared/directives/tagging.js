(function () {

	var tagging = function (RestService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "shared/directives/tagging.html";

		directive.scope = {
			model: '=',
			group: '@',
			noun: '@'
		};

		directive.link = function ($scope, element, attrs) {


			$scope.tags = [];
			RestService.getTags($scope.group)
				.success(function(data){
					$scope.tags=data._items.map(function(t){return t.tag});
				});

			$scope.onSelect = function(item, model){
				console.log("Onselect "+item);
				RestService.addTag(item,$scope.group);
			};


		};

		return directive;
	};

	angular.module('reportingApp').directive('tagging', tagging);

})();


(function () {

	var populartags = function (RestService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "shared/directives/populartags.html";

		directive.scope = {
			group: '@',
			noun: '@'
		};

		directive.link = function ($scope, element, attrs) {

			$scope.tags = [];
			RestService.getMostPopularTags($scope.group)
				.success(function(data){
					$scope.tags=data._items.map(function(t){return t.tag});
				});


		};

		return directive;
	};

	angular.module('reportingApp').directive('populartags', populartags);

})();