(function () {

	var tagging = function (RestService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "shared/directives/tagging.html";

		directive.scope = {
			model: '=',
			group: '@',
			input: '='
		};

		directive.link = function ($scope, element, attrs) {

			$scope.tags = $scope.input;

			$scope.onSelect = function(item, model){
				console.log("Onselect "+item);
				RestService.addTag(item,$scope.group);
			};


		};

		return directive;
	};

	angular.module('reportingApp').directive('tagging', tagging);

})();