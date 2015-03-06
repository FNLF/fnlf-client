var ihelp = angular.module('ih', ['mgcrea.ngStrap.popover']);

ihelp.directive('inlinehelp',  function() {
	
	var directive = {};

	directive.restrict = 'E';
	directive.template = function(tElement, tAttrs) { 
		
		return '<i data-placement="top-right" title="{{title}}" data-content="{{content}}" data-trigger="click" bs-popover class="fa fa-question-circle fa-fw text-info"></i>';
	};

	directive.scope = {
		title: '=',
		content: '='

	};
	
	directive.controller = function($scope, $rootScope, $location, $aside) {
	};

	directive.link = function ($scope, element, attrs) {

	};

	return directive;

});
