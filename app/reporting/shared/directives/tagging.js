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

			$scope.tags = $scope.input;

		};

		return directive;
	};

	angular.module('reportingApp').directive('tagging', tagging);

})();