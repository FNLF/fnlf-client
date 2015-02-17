(function () {

	var tagging = function (RestService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "shared/directives/tagging.html";

		directive.scope = {
			model: '=',
			category: '=',
			input: '='
		};

		directive.link = function ($scope, element, attrs) {

			$scope.tagsFromDb = [];

			if(angular.isDefined($scope.input)){
				$scope.tagsFromDb = [].concat($scope.input);
			}

			$scope.tags = [].concat($scope.model,$scope.tagsFromDb);
			$scope.tagSelected = function ($item, $model){
				$scope.tags.push($item);
			};

			$scope.getTags = function (name) {
				$scope.tags = [].concat($scope.tagsFromDb,$scope.model);

			};

		};

		return directive;
	};

	angular.module('reportingApp').directive('tagging', tagging);

})();