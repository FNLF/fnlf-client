angular.module('resolve')
	.directive('resolveuser', function ($http, $q, ResolveService) {

		var directive = {};

		directive.restrict = 'E';
		directive.template = '<span>{{::firstname}} {{::lastname}}</span>';

		directive.scope = {
			userid: '=',
			tmpname: '='
		};

		directive.link = function ($scope, element, attrs) {
			var unbind = $scope.$watch('userid', function () {
				if ($scope.userid) {
					if ($scope.userid > 0) {
						ResolveService.getUser($scope.userid).then(
							function (user) {
								$scope.firstname = user.firstname;
								$scope.lastname = user.lastname;
							});
					}
					else if ($scope.userid < 0) {
						$scope.firstname = 'Hopper';
						$scope.lastname = -1 * $scope.userid;
						if ($scope.tmpname) {
							delete $scope.tmpname;
						}

					}
					unbind();
				}
			});


		};
		return directive;
	});