(function () {

	var observationComponent = function (RestService, Definitions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/reporting/components/component/directives/observationComponent.html";
/*
		directive.scope = {
			observation: '=',
			component: '='
		};
*/
		directive.link = function ($scope, element, attrs) {

			$scope.resolvePersonsFn();

		};
		return directive;
	};

	angular.module('reportingApp').directive('observationComponent', observationComponent);

})();