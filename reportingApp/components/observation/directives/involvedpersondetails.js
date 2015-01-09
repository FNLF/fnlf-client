angular.module('reportingApp').directive('involvedpersondetails', function () {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "reportingApp/components/observation/directives/involvedpersondetails.html";

	directive.scope = {
		observation: '='
	};

	directive.link = function ($scope, element, attrs) {


	};

	return directive;
});