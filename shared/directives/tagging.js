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
					$scope.tags = Functions.prepareTags(r);
				});

			$scope.tooManyWordsInTag = false;

			$scope.$watch('model',function(){
				if(!angular.isUndefined($scope.model)) {
					var allTagsShortEnough = true;

					angular.forEach($scope.model, function (t) {

						if (t.split(' ').length >= 5) {
							allTagsShortEnough = false;
						}

					});
					$scope.tooManyWordsInTag = !allTagsShortEnough;
				}
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


