
angular.module('resolve').directive('resolveobservationtype', function (ResolveService) {
		
	var directive = {};
	
	directive.restrict = 'E';
	//directive.template = '<span class="label pull-right" ng-class="{sharing:\'label-success\', unsafe_act:\'label-default\', near_miss:\'label-info\', incident:\'label-warning\', accident:\'label-danger\'}[type]" class="label">{{observationname}}</span>';
	directive.template = '{{::observationname}}';
	directive.scope = {
			
			type: '=',
	};
	
	directive.link = function ($scope, element, attrs) {
		
		$scope.observationname = ResolveService.resolveObservationType($scope.type);

	};
	
	return directive;
			
});


angular.module('resolve').directive('resolveobservationtypelabel', function (ResolveService) {

	var directive = {};

	directive.restrict = 'E';
	directive.template = '<span> <span class="label pull-right" ng-class="{sharing:\'label-success\', unsafe_act:\'label-default\', near_miss:\'label-info\', incident:\'label-warning\', accident:\'label-danger\'}[type]" class="label">{{observationname}}</span>&nbsp;</span>';

	directive.scope = {

		type: '=',
	};

	directive.link = function ($scope, element, attrs) {

		$scope.observationname = ResolveService.resolveObservationType($scope.type);

	};

	return directive;

});