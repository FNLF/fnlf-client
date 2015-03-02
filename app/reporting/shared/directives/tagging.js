(function () {

	var tagging = function (RestService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "shared/directives/tagging.html";

		directive.scope = {
			model: '=',
			group: '@',
			noun: '@'
		};

		directive.link = function ($scope, element, attrs) {

			$scope.onSelect = function(item, model){
				RestService.addTag(item,$scope.group);
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

	angular.module('reportingApp').directive('tagging', tagging);

})();


(function () {

	var populartags = function (RestService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "shared/directives/populartags.html";

		directive.scope = {
			group: '@',
			noun: '@'
		};

		directive.link = function ($scope, element, attrs) {

			$scope.tags = [];
			RestService.getMostPopularTags($scope.group)
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

	angular.module('reportingApp').directive('populartags', populartags);

})();