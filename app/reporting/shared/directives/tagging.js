(function () {

	var tagging = function (RestService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "shared/directives/tagging.html";

		directive.scope = {
			model: '=',
			category: '='

		};

		directive.link = function ($scope, element, attrs) {

			$scope.tagsFromDb = [];
			$scope.tagsFromDb.push("Tvinn og spinn");
			$scope.tagsFromDb.push("Overtråkk");
			$scope.tagsFromDb.push("Utelanding");
			$scope.tagsFromDb.push("Lavtrekk");

			$scope.tags = [].concat($scope.model.tags,$scope.tagsFromDb);
			$scope.tagSelected = function ($item, $model){
				$scope.tags.push($item);
			};

			$scope.getTags = function (name) {
				$scope.tags = [].concat($scope.tagsFromDb,$scope.model.tags);

			};

		};

		return directive;
	};

	angular.module('reportingApp').directive('tagging', tagging);

})();