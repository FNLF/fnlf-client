var inlinehelp = angular.module('inlinehelp', []);


inlinehelp.directive('inlinehelp',  function() {
	
	var directive = {};

	directive.restrict = 'E';
	directive.transclude = true;

	directive.scope = {
		title: '@'
	};

	directive.template = function(tElement, tAttrs) {
		
		return '<span ng-click="flip()"><span><label ng-bind="title"></label> <span class=""> <i class="fa fa-question-circle fa-fw"></i> </span> </span><div collapse="isCollapsed"><div class="panel panel-default"><div class="panel-body inlinehelpbody"><div ng-transclude></div> </div></div></div> </span>';

	};



	directive.link = function ($scope, element, attrs) {

		$scope.isCollapsed=true;

		$scope.flip = function(){
			$scope.isCollapsed=!$scope.isCollapsed;
		};


	};

	return directive;

});
