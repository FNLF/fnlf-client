angular.module('reportingApp').directive('observationHfkSelector', function (Definitions) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "components/observation/directives/observationHfkSelector.html";

	directive.scope = {
		model: '='
	};

	directive.link = function ($scope, element, attrs) {

		$scope.isPositive = function (what) {
			return ($scope.model[what] > 0);
		};
		$scope.isNegative = function (what) {
			return ($scope.model[what] < 0);
		};
		$scope.isNeutral = function (what) {
			return ($scope.model[what] == 0);
		};

		$scope.flip = function (what) {


			if (angular.isUndefined($scope.model[what]) || $scope.model[what] == 0) {
				$scope.model[what] = -1;

			} else if ($scope.model[what] > 0) {
				$scope.model[what] = 0;

			} else if ($scope.model[what] < 0) {
				$scope.model[what] = 1;

			}
		};

	};

	return directive;
});