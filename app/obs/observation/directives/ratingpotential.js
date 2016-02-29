angular.module('reportingApp').directive('ratingPotential', function (Definitions) {
		
		   var directive = {};

		directive.restrict = 'E';

		directive.template = function(tElement, tAttrs) { 
			
			return '{{ratingType}}: <rating ng-model="observation.rating.potential" max="8" readonly="false" state-on="\'fa fa-bullseye\'" state-off="\'fa fa-circle-o\'" on-hover="hoveringOver(value)" on-leave="overStar = null"> \
					</rating> \
					<span class="label" ng-class="{\'label-success\': overStar<3, \'label-info\': overStar>=3 && overStar<6,\'label-warning\': overStar>=5 && overStar<7, \'label-danger\': overStar>=7}" \
					ng-show="overStar && !isReadonly">{{overStar}} {{scaling[overStar]}}</span>';
		};

		directive.scope = {
			observation: '=',
			acl: '='
		};

		
		directive.controller = function ($scope) {
			 
//			if(type == 'actual') $scope.ratingType = 'Faktisk';
//			else if(type == 'potential') $scope.ratingType = 'Potensiell';
//			else if(type == 'user') $scope.ratingType = 'Bruker';
			

		};
		
		directive.link = function ($scope, element, attrs) {

			$scope.scaling = Definitions.getRatingScale();
			
			$scope.ratingType = 'Potensiell';
			
			$scope.observation.rating.potential = $scope.observation.rating.potential || 1;
			
			$scope.hoveringOver = function(value) {
			  	$scope.overStar = value;
			};
			  

		};

		return directive;
});