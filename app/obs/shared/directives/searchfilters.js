angular.module('reportingApp').directive('searchfilters', function () {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "/app/obs/shared/directives/searchfilters.html";

	directive.scope = {
		filter:'='
	};

	directive.controller = function(){

	};

	directive.link = function ($scope, element, attrs) {
		$scope.allacl={w:true};
	};

	return directive;
});
