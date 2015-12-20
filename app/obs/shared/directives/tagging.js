(function () {

	var tagging = function (RestService,Functions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/shared/directives/tagging.html";

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

	angular.module('reportingApp').directive('tagging', tagging);

})();


(function () {

	var populartags = function (RestService,Functions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/shared/directives/populartags.html";

		directive.scope = {
			group: '@',
			noun: '@'
		};

		directive.link = function ($scope, element, attrs) {

			$scope.tags = [];
			RestService.getMostPopularTags($scope.group)
				.then(function(data){
					$scope.tags = Functions.deduplicate(data._items
						.map(function(t){
							return Functions.capitalizeFirstLetter(t.tag);
						}));
				});


		};

		return directive;
	};

	angular.module('reportingApp').directive('populartags', populartags);

})();

(function () {

	var tagsDirective = function (RestService,Functions) {
		var directive = {};

		directive.restrict = 'E';
		directive.template = '<span> \
			<span ng-if="::tag"><a href="/app/obs/#!/search/tag/{{::tag}}">{{::tag}} </a></span>\
			<span ng-if="::tags" ng-repeat="tag in ::tags track by $index"> \
			<a href="/app/obs/#!/search/tag/{{::tag}}">{{::tag}}</a> <span ng-show="!$last">/ </span> \
			</span> \
			';

		directive.scope = {
			tags: '=',
			tag: '='
		};

		directive.link = function ($scope, element, attrs) {




		};

		return directive;
	};

	angular.module('reportingApp').directive('tags', tagsDirective);

})();

