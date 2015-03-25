(function () {

	var observationComponent = function (RestService, Definitions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/components/component/directives/observationComponent.html";
/*
		directive.scope = {
			observation: '=',
			component: '='
		};
*/
		directive.link = function ($scope, element, attrs) {
			$scope.componentWhatSelected = function(){
				console.log($scope.component.what);
				$scope.component.editTitle=false;
				RestService.addTag($scope.component.what,"what");
			};


			$scope.resolvePersonsFn();

			$scope.whatEdited = function(component){
				component.editTitle=false;

				RestService.addTag(component.what,"what");
			};
		};
		return directive;
	};

	angular.module('reportingApp').directive('observationComponent', observationComponent);

})();