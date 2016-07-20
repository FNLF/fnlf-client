angular.module('reportingApp').directive('involvedSummary', function () {

	var directive = {};

	directive.restrict = 'E';
	directive.template = '<div class="table-responsive"><table class="table table-condensed table-responsive"><tr ng-repeat="person in observation.involved"><td><span><involvedpersonsummary person="person"></involvedpersonsummary> &nbsp;</span> </td></tr></table></div>';

	directive.scope = {
		observation: '=',
		acl: '='
	};

	directive.link = function ($scope, element, attrs) {

	};

	return directive;
});
