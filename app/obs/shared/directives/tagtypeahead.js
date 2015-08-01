(function () {

	var tagtypeahead = function (RestService,Functions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/shared/directives/tagtypeahead.html";

		directive.scope = {
			model:'=',
			group: '@',
			noun: '@',
			selectfn: '='
		};

		directive.link = function ($scope, element, attrs) {

			if($scope.model instanceof Array){
				$scope.model = "";
			}

			$scope.onSelect = function(item, model,label){
				RestService.addTag(Functions.capitalizeFirstLetter(item),$scope.group);
				$scope.model=item;
				if($scope.selectfn){
					$scope.selectfn();
				}

			};

			$scope.tags = [];
			RestService.getTags($scope.group)
				.success(function(data){
					$scope.tags = Functions.deduplicate(data._items.filter(function(t){return t.freq>=0}).map(function(t){return t.tag}));
				});
		};

		return directive;
	};

	angular.module('reportingApp').directive('tagtypeahead', tagtypeahead);

})();