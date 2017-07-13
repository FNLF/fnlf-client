angular.module('reportingApp').directive('involvedperson', function (RestService) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "involved/directives/involvedperson.html";

	directive.scope = {
		person: '=',
		jumptypes: '=',
		licensesFromMelwin: '=',
		acl: '='

	};

	directive.link = function ($scope, element, attrs) {

	

	};

	return directive;
});
