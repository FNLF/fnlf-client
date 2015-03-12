
angular.module('resolve').directive('resolveclub', function (ResolveService) {
		
	var directive = {};
	
	directive.restrict = 'E';
//	directive.template = '<a href="/app/club/{{clubid}}">{{name}}</a>';
	directive.template = '{{name}}';
	
	directive.scope = {
			
			clubid: '=',
	};
	
	directive.link = function ($scope, element, attrs) {
	
		ResolveService.getClub($scope.clubid).then(function(club) {
			
			$scope.name = club.name;
		});
	};
	
	return directive;
			
});