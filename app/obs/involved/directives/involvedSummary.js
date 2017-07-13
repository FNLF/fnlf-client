angular.module('reportingApp').directive('involvedSummary', function (InvolvedService) {

	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl= '/app/obs/involved/directives/involvedSummary.html';

	directive.scope = {
		observation: '=',
		acl: '='
	};
	
	directive.controller = function ($scope) {
		$scope.oninvolvedselected = function (user) {
			InvolvedService.getUserDetails(user);
			InvolvedService.getUserGearAndjumps(user);
		};
	};
	
	directive.link = function ($scope, element, attrs) {
	
	};

	return directive;
});
