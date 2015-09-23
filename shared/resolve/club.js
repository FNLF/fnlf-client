
angular.module('resolve').directive('resolveclub', function (ResolveService) {
		
	var directive = {};
	
	directive.restrict = 'E';
//	directive.template = '<a href="/app/club/{{clubid}}">{{name}}</a>';
	directive.template = '{{::name}}';
	
	directive.scope = {
			
			clubid: '=',
			long:	'=',
	};
	
	directive.link = function ($scope, element, attrs) {
	
		ResolveService.getClub($scope.clubid).then(function(club) {
			
			if($scope.long) $scope.name = club.name
			else $scope.name = club.name.replace(' Fallskjermklubb', '');
		});
	};
	
	return directive;
			
});