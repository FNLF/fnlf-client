angular.module('resolve')
	.directive('resolveuser', function ($http, $q, ResolveService) {

		var directive = {};

		directive.restrict = 'E';
		directive.template = '<span>{{::name}}</span>';

		directive.scope = {
			userid: '=',
			tmpname: '='
		};

		directive.link = function ($scope, element, attrs) {
			var unbind = $scope.$watch('userid', function () {
				if ($scope.userid) {
					ResolveService.getUserName($scope.userid,$scope.tmpname)
						.then(function(name){
							$scope.name = name;
						});
					unbind();
				}
			});


		};
		return directive;
	});