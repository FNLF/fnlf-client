angular.module('resolve')
	   .directive('resolveuser', function($http, $q, ResolveService) {

			var directive = {};
			
			directive.restrict = 'E';
			directive.template = '<a href="/app/profile/#!/{{userid}}">{{firstname}} {{lastname}}</a>';
			
			directive.scope = {
				userid : '='
			};
			
			directive.link = function($scope, element, attrs) {
				
				ResolveService.getUser($scope.userid).then(
					function(user) {
						$scope.firstname = user.firstname;
						$scope.lastname = user.lastname;
					});
				};					;
				return directive;
		});
