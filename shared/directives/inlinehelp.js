var inlinehelp = angular.module('inlinehelp', []);
//'mgcrea.ngStrap.popover' 'ui.bootstrap'

inlinehelp.directive('inlinehelp',  function() {
	
	var directive = {};

	directive.restrict = 'E';
	directive.transclude = true;
	directive.template = function(tElement, tAttrs) { 
		
		return '<span ng-click="flip()"><span class="h2">{{title}}<i class="fa fa-question-circle fa-fw text-primary"></i></span><div collapse="isCollapsed"><div class="well well-lg" ng-transclude></div></div> </span>';
		//return '<i data-placement="top-right" title="{{title}}" data-content="{{content}}" data-trigger="click" bs-popover class="fa fa-question-circle fa-fw text-info"></i>';
		//return '<i tooltip-trigger="mousenter" tooltip-placement="right" tooltip="{{content}}" data-trigger="click" bs-popover class="fa fa-question-circle fa-fw text-info"></i>';
	};

	directive.scope = {
		title: '=',
		content: '='

	};
	
//	directive.controller = function($scope, $rootScope, $location, $popover) {
//	};

	directive.link = function ($scope, element, attrs) {

		$scope.isCollapsed=true;

		$scope.flip = function(){
			$scope.isCollapsed=!$scope.isCollapsed;

		};


	};

	return directive;

});
