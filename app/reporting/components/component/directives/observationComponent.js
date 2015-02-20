(function () {

	var observationComponent = function (RestService, Definitions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "components/component/directives/observationComponent.html";
/*
		directive.scope = {
			observation: '=',
			component: '='
		};
*/
		directive.link = function ($scope, element, attrs) {



		};
		return directive;
	};

	angular.module('reportingApp').directive('observationComponent', observationComponent);

})();