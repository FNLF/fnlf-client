angular.module('resolve')
	   .directive('resolveuser', function($http, $q, ResolveService) {

			var directive = {};
			
			directive.restrict = 'E';
			directive.template = '<a href="/app/profile/{{userid}}">{{firstname}} {{lastname}}</a>';
			
			directive.scope = {
			
				userid : '='
			};
			
			directive.link = function($scope, element, attrs) {
			
				$scope.$watch('observation', function(newValue, oldValue) {
			
					if (newValue && newValue._id) {
			
						console.log("Resolve USER");
			
							ResolveService.getUser($scope.userid).then(
									function(user) {
			
										console.log(user);
										$scope.firstname = user.firstname;
										$scope.lastname = user.lastname;
									});
						}
						;
			
					});
				};
			
				return directive;
			
		});
