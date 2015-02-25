angular.module('reportingApp').directive('ratingPotential', function () {
		
		   var directive = {};

		directive.restrict = 'E';
		//directive.templateUrl = "components/observation/directives/organization.html";
		directive.template = function(tElement, tAttrs) { 
			
			return '{{ratingType}}: <rating ng-model="observation.rating.potential" max="10" readonly="false" state-on="\'fa fa-bullseye\'" state-off="\'fa fa-circle-o\'" on-hover="hoveringOver(value)" on-leave="overStar = null"> \
					</rating> \
			<span class="label" ng-class="{\'label-success\': overStar<3, \'label-info\': overStar>=3 && overStar<5,\'label-warning\': overStar>=5 && overStar<7, \'label-danger\': overStar>=7}" \
					ng-show="overStar && !isReadonly">{{overStar}}</span>';
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
			};
			  

		};

		return directive;
});