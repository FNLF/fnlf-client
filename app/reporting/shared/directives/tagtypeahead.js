(function () {

	var tagtypeahead = function (RestService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "shared/directives/tagtypeahead.html";

		directive.scope = {
			model:'=',
			group: '@',
			noun: '@'
		};

		directive.link = function ($scope, element, attrs) {

			$scope.onSelect = function(item, model,label){
				console.log("onSelect "+item+" "+model+" "+label);
				RestService.addTag(item,$scope.group);
				$scope.model=model;
			};

			$scope.tags = [];
			RestService.getTags($scope.group)
				.success(function(data){
					$scope.tags=data._items.map(function(t){return t.tag});
				});
		};

		return directive;
	};

	angular.module('reportingApp').directive('tagtypeahead', tagtypeahead);

})();