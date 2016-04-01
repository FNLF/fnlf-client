angular.module('reportingApp').directive('organizationSummary', function () {

	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "observation/directives/organization/organizationSummary.html";

	directive.scope = {
		observation: '=',
		acl: '='
	};

	directive.link = function ($scope, element, attrs) {

	};

	return directive;
});