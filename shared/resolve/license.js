angular.module('resolve').directive('resolvelicense', function (ResolveService) {

	var directive = {};

	directive.restrict = 'E';
//	directive.template = '<a href="/app/license/{{licenseid}}">{{name}}</a>';
	directive.template = '{{name}}';

	directive.scope = {

		licenseid: '=',
	};

	directive.link = function ($scope, element, attrs) {

		var unbind = $scope.$watch('licenseid', function () {
			if ($scope.licenseid) {
				$scope.name = $scope.licenseid;
				ResolveService.getLicense($scope.licenseid).then(function (license) {
					$scope.name = license.name;
				});
				unbind();
			}

		});


	};

	return directive;

});