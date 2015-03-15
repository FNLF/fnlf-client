(function () {

	var tagtypeahead = function (RestService,Functions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/shared/directives/tagtypeahead.html";

		directive.scope = {
			model:'=',
			group: '@',
			noun: '@'
		};

		directive.link = function ($scope, element, attrs) {

			if($scope.model instanceof Array){
				$scope.model = "";
			}

			$scope.onSelect = function(item, model,label){

				RestService.addTag(item,$scope.group);
				$scope.model=item;
			};

			$scope.tags = [];
			RestService.getTags($scope.group)
				.success(function(data){
					$scope.tags = Functions.deduplicate(data._items.map(function(t){return t.tag}));
				});
		};

		return directive;
	};

	angular.module('reportingApp').directive('tagtypeahead', tagtypeahead);

})();