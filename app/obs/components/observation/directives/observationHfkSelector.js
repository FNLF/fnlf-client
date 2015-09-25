angular.module('reportingApp').directive('observationHfkSelector', function (Definitions) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "components/observation/directives/observationHfkSelector.html";

	directive.scope = {
		model: '=',
		verbose: '@',
	};

	directive.link = function ($scope, element, attrs) {
		
		if($scope.verbose=='true') $scope.verbose = true;
		else $scope.verbose = false;
		
		//Backward compatible!
		if(!$scope.model) $scope.model = {a: 0, s: 0, k: 0};
		
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