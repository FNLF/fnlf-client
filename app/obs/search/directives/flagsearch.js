angular.module('reportingApp').directive('flagsearch', function (RestService, Functions, $location, Definitions) {
	var directive = {};

	directive.restrict = 'E';
	directive.template = '<flags attributes = "all"></flags>';

	directive.scope = {};

	directive.link = function ($scope, element, attrs) {
		$scope.all = {};
		angular.forEach(Definitions.getComponentAttributes(), function (a) {
			$scope.all[a.attribute] = true;
		});
	};

	return directive;
});
