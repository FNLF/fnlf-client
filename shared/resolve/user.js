angular.module('resolve')
	.directive('resolveuser', function ($http, $q, ResolveService) {

		var directive = {};

		directive.restrict = 'E';
//		directive.template = '<span ng-if="userid==0">{{tmpname}}</span><span ng-if="userid!=0"><a href="/app/profile/{{userid}}">{{firstname}} {{lastname}}</a></span>';
		directive.template = '<span ng-if="userid==0">{{tmpname}}</span><span ng-if="userid!=0">{{firstname}} {{lastname}}</span>';

		directive.scope = {
			userid: '=',
			tmpname: '='
		};

		directive.link = function ($scope, element, attrs) {
			if ($scope.userid > 0) {
				ResolveService.getUser($scope.userid).then(
					function (user) {
						$scope.firstname = user.firstname;
						$scope.lastname = user.lastname;
					});
			}
			else if($scope.userid == -1) {
				$scope.firstname = 'Anonyme';
				$scope.lastname = 'Anonymesen';
			}

		};
		return directive;
	});