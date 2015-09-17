
angular.module('resolve').directive('resolveworkflowstate', function (ResolveService) {
		
	var directive = {};
	
	directive.restrict = 'E';
	//directive.template = '<span class="label pull-right" ng-class="{sharing:\'label-success\', unsafe_act:\'label-default\', near_miss:\'label-info\', incident:\'label-warning\', accident:\'label-danger\'}[type]" class="label">{{state}}</span>';
	directive.template = '{{::resolved}}';
	directive.scope = {
			
			state: '=',
	};
	
	directive.link = function ($scope, element, attrs) {
		
		$scope.resolved = ResolveService.resolveObservationWorkflowState($scope.state);

	};
	
	return directive;
			
});