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

				RestService.addTag(item,$scope.group);
				$scope.model=item;
			};

			$scope.tags = [];
			RestService.getTags($scope.group)
				.success(function(data){
					var allTags=data._items.map(function(t){return t.tag});

					var tmp ={};
					allTags.forEach(function(t){
						tmp[t]=t;
					});
					Object.keys(tmp).forEach(function(k){
						$scope.tags.push(tmp[k]);
					});
				});
		};

		return directive;
	};

	angular.module('reportingApp').directive('tagtypeahead', tagtypeahead);

})();