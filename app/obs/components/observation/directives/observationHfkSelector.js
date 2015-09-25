angular.module('reportingApp').directive('observationHfkSelector', function (Definitions) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "components/observation/directives/observationHfkSelector.html";

	directive.scope = {
		observation: '='
	};

	directive.link = function ($scope, element, attrs) {
		$scope.model={};

		$scope.flip = function(what){
			 if(angular.isUndefined($scope.model[what]) || $scope.model[what] == 0 ){
				$scope.model[what]=-1;

			}else if($scope.model[what] > 0){
				$scope.model[what]=0;

			} else if($scope.model[what] < 0){
				 $scope.model[what]=1;

			 }
		};

	};

	return directive;
});