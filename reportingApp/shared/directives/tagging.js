(function () {

	var tagging = function (RestService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "reportingApp/shared/directives/tagging.html";

		directive.scope = {
			model: '=',
			category: '='
		};

		directive.link = function ($scope, element, attrs) {

			$scope.tags = [];
			$scope.tags.push("Tvinn og spinn");
			$scope.tags.push("Jentelanding");
			$scope.tags.push("Idiot");

			$scope.tagSelected = function ($item, $model){
				$scope.tags.push($item);
			};

			$scope.getTags = function (name) {
				if(name.length>2){
				/*
						RestService.getTags($scope.category,name)
						.success(function (response) {
							$scope.tags = response._items;
						});
						*/
				}
			};

		};

		return directive;
	};

	angular.module('reportingApp').directive('tagging', tagging);

})();