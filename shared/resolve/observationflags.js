
angular.module('resolve').directive('resolveobservationflags', function (ResolveService) {
		
	var directive = {};
	
	directive.restrict = 'E';
	//directive.template = '<span class="label pull-right" ng-class="{sharing:\'label-success\', unsafe_act:\'label-default\', near_miss:\'label-info\', incident:\'label-warning\', accident:\'label-danger\'}[type]" class="label">{{observationname}}</span>';
	//directive.template = '<span ng-repeat="flag in ::observationflags">{{flag}} </span>';
	directive.template = "{{::observationflags.join(', ')}}";
	directive.scope = {
			
			flags: '=',
	};
	
	directive.link = function ($scope, element, attrs) {
		
		$scope.observationflags = [];
		

		
		if(!$scope.flags || $scope.flags.length == 0) {
			
			$scope.observationflags.push('Ingen');
		}
		else {   
			if($scope.flags.insurance) {
				$scope.observationflags.push('Forsikringssak');
			}
			
			if($scope.flags.aviation) {
				$scope.observationflags.push('Luftfartshendelse');
			}
		}
		

	};
	
	return directive;
			
});
