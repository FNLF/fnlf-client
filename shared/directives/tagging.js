(function () {

	var tagging = function (RestService,Functions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/shared/directives/tagging.html";

		directive.scope = {
			model: '=',
			group: '@',
			noun: '@',
			acl: '=',
		};

		directive.link = function ($scope, element, attrs) {

			$scope.onSelect = function(item, model){
				RestService.addTag(Functions.capitalizeFirstLetter(item),$scope.group);

				if($scope.model){
					$scope.model = $scope.model.map(function(t){return Functions.capitalizeFirstLetter(t)});
				}
			};

			$scope.tags = [];
			RestService.getTags($scope.group)
				.then(function(r){
					$scope.tags = Functions.deduplicate(r._items.filter(function(t){return t.freq>=0}).map(function(t){return t.tag}));
				});


			$scope.refresh = function(search){
/*
				if(search){
					search = Functions.capitalizeFirstLetter(search);
					RestService.getTagsByRegex(search,$scope.group)
						.then(function(r){



						});
				}
*/
			};

		};

		return directive;
	};

	angular.module('fnlf-directives').directive('tagging', tagging);

})();


