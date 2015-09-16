(function () {

	var flagsDirective = function () {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/components/component/directives/flags.html";

		directive.scope = {
			attributes: '='
		};

		directive.link = function ($scope, element, attrs) {

		};

		return directive;
	};

	angular.module('reportingApp').directive('flags', flagsDirective);

})();

(function () {

	var flagDirective = function () {
		var directive = {};

		directive.restrict = 'E';
		directive.template = '<span><a href="/app/obs/#!/search/flag/{{attribute}}"><span ng-transclude></span></a></span>';
		directive.transclude=true;
		directive.scope = {
			attribute: '@'
		};

		directive.link = function ($scope, element, attrs) {

		};

		return directive;
	};

	angular.module('reportingApp').directive('flag', flagDirective);

})();