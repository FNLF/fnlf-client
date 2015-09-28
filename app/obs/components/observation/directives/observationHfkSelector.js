angular.module('reportingApp').directive('observationHfkSelector', function (Definitions) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "components/observation/directives/observationHfkSelector.html";

	directive.scope = {
		model: '=',
		verbose: '@',
		editmode: '@'
	};

	directive.link = function ($scope, element, attrs) {



		$scope.askValues = [
			{key:'knowledge',label:'Kunnskaper',},
			{key:'skills',label:'Ferdigheter'},
			{key:'attitude',label:'Holdninger'}
		];


		$scope.isPositive = function (what) {
			if(!$scope.model){return false;}
			return ($scope.model[what] > 0);
		};
		$scope.isNegative = function (what) {
			if(!$scope.model){return false;}
			return ($scope.model[what] < 0);
		};
		$scope.isNeutral = function (what) {
			if(!$scope.model){return false;}
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