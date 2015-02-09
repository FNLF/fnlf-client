
angular.module('resolve').directive('resolveclub', function (ResolveService) {
		
	var directive = {};
	
	directive.restrict = 'E';
	directive.template = '<a href="/app/club/{{clubid}}">{{name}}</a>';
	
	directive.scope = {
			
			clubid: '=' 
	};
	
	directive.link = function ($scope, element, attrs) {
	
		$scope.$watch('observation',function(newValue,oldValue) {
			
			if(newValue && newValue._id) {
				console.log("Resolve CLUB");
				
				ResolveService.getClub($scope.clubid).then(function(club) {
					$scope.name = club.name;
				});
			};
		
		
	
		});
	};
	
	return directive;
			
});