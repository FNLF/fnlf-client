(function () {

	var incidentform = function () {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "components/observation/directives/incidentform.html";

		directive.scope = {
			observation: '='
		};

		directive.link = function ($scope, element, attrs) {


		};

		return directive;
	};

	angular.module('reportingApp').directive('incidentform', incidentform);

})();