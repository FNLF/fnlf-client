var inlinehelp = angular.module('inlinehelp', ['mgcrea.ngStrap.tooltip','mgcrea.ngStrap.popover']);
//'mgcrea.ngStrap.popover' 'ui.bootstrap'

inlinehelp.directive('inlinehelp',  function() {
	
	var directive = {};

	directive.restrict = 'E';
	directive.template = function(tElement, tAttrs) { 
		
		return '<a data-trigger="click" data-type="success" data-title="{{tooltip.title}}" bs-tooltip ><i class="fa fa-question-circle fa-fw text-info"></i></a>';
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

	};

	return directive;

});
