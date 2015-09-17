
angular.module('resolve').directive('resolvelicense', function (ResolveService) {
		
	var directive = {};
	
	directive.restrict = 'E';
//	directive.template = '<a href="/app/license/{{licenseid}}">{{name}}</a>';
	directive.template = '{{::name}}';
	
	directive.scope = {
			
			licenseid: '=',
	};
	
	directive.link = function ($scope, element, attrs) {
	
		ResolveService.getLicense($scope.licenseid).then(function(license) {
			
			$scope.name = license.name;
		});
	};
	
	return directive;
			
});