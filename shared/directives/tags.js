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

	angular.module('fnlf-directives').directive('tags', tagsDirective);

})();
