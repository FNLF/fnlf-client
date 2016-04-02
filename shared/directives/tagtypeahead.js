(function () {

	var tagtypeahead = function (RestService,Functions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/shared/directives/tagtypeahead.html";

		directive.scope = {
			model:'=',
			group: '@',
			noun: '@',
			selectfn: '=',
			acl: '='
		};

		directive.link = function ($scope, element, attrs) {

			if($scope.model instanceof Array){
				$scope.model = "";
			}

			$scope.capitalize = function(){
				$scope.model = Functions.capitalizeFirstLetter($scope.model);
			};

			$scope.onSelect = function(item, model,label){
				$scope.model = Functions.capitalizeFirstLetter(model);
				RestService.addTag($scope.model,$scope.group);

				if($scope.selectfn){
					$scope.selectfn();
				}
			};

			$scope.tags = [];

			$scope.refresh = function(){
				RestService.getTags($scope.group)
					.then(function(data){
						$scope.tags = Functions.deduplicate(data._items
							.filter(function(t){
								return t.freq>=0
							})
							.map(function(t){
								return Functions.capitalizeFirstLetter(t.tag);
							}));
					});
			};

			$scope.refresh();

		};

		return directive;
	};

	angular.module('fnlf-directives').directive('tagtypeahead', tagtypeahead);

})();