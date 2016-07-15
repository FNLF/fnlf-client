angular.module('reportingApp').directive('fullscreen', function ($location) {
	var directive = {};

	directive.restrict = 'E';
	directive.transclude=true;
	directive.templateUrl = "observation/directives/fullscreen.html";

	directive.scope = {
		observation: '=',
		acl: '=',
		title: '@'
	};

	directive.link = function ($scope, element, attrs) {

		$scope.hideFullscreen = function(){
			$location.search('ui','');
		};

	};

	return directive;
});