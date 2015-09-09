var inlinehelp = angular.module('inlinehelp', []);


inlinehelp.directive('inlinehelp',  function() {
	
	var directive = {};

	directive.restrict = 'E';
	directive.transclude = true;

	directive.scope = {
		title: '@'
	};

	directive.template = function(tElement, tAttrs) {
		
		return '<span ng-click="flip()"><span class="h2"><span ng-bind="title"></span> <i class="fa fa-question-circle fa-fw text-primary"></i></span><div collapse="isCollapsed"><div class="panel panel-default"><div class="panel-body" ng-transclude></div></div></div> </span>';

	};



	directive.link = function ($scope, element, attrs) {

		$scope.isCollapsed=true;

		$scope.flip = function(){
			$scope.isCollapsed=!$scope.isCollapsed;
		};


	};

	return directive;

});
