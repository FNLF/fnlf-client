angular.module('reportingApp').directive('involvedSummary', function () {

	var directive = {};

	directive.restrict = 'E';
	directive.template = '<table class="table"><tr ng-repeat="person in observation.involved"><td><span><involvedpersonsummary person="person"></involvedpersonsummary> &nbsp;</span> </td></tr></table>';

	directive.scope = {
		observation: '=',
		acl: '='
	};

	directive.link = function ($scope, element, attrs) {

	};

	return directive;
});
