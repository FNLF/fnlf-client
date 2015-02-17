angular.module('reportingApp').directive('ratingPotential', function () {
		
		   var directive = {};

		directive.restrict = 'E';
		//directive.templateUrl = "components/observation/directives/organization.html";
		directive.template = function(tElement, tAttrs) { 
			
			return '{{ratingType}}: <rating ng-model="observation.rating.potential" max="5" readonly="false" on-hover="hoveringOver(value)" on-leave="overStar = null"> \
					</rating> \
					<span class="label" ng-class="{\'label-success\': percent<30, \'label-info\': percent>=30 && percent<50,\'label-warning\': percent>=50 && percent<70, \'label-danger\': percent>=70}" \
					ng-show="overStar && !isReadonly">{{percent}}%</span>';
		};

		directive.scope = {
			observation: '=',
		};

		
		directive.controller = function ($scope) {
			 
//			if(type == 'actual') $scope.ratingType = 'Faktisk';
//			else if(type == 'potential') $scope.ratingType = 'Potensiell';
//			else if(type == 'user') $scope.ratingType = 'Bruker';

		};
		
		directive.link = function ($scope, element, attrs) {

			$scope.ratingType = 'Potensiell';
			
			$scope.observation.rating.potential = $scope.observation.rating.potential || 0;
			
			$scope.hoveringOver = function(value) {
			  	$scope.overStar = value;
			  	$scope.percent = 100 * (value / 5);
			};
			  

		};

		return directive;
});