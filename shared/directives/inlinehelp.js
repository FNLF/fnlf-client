var inlinehelp = angular.module('inlinehelp', []);


inlinehelp.directive('inlinehelp',  function() {
	
	var directive = {};

	directive.restrict = 'E';
	directive.transclude = true;

	directive.scope = {
		title: '@'
	};

	directive.template = function(tElement, tAttrs) {
		return '<span ng-click="flip()"> \
					<span><label ng-bind="title"></label> \
					<i ng-mouseenter="hover = true;" ng-mouseleave="hover = false;" ng-class="{\'text-info\': hover, \'text-muted\': !hover}" class="fa fa-info-circle fa-fw"></i>\
					</span>\
					<div collapse="isCollapsed">\
						<div class="alert alert-info" role="alert"><div ng-transclude></div></div>\
					</div> \
				</span>';

	};



	directive.link = function ($scope, element, attrs) {

		$scope.isCollapsed=true;

		$scope.flip = function(){
			$scope.isCollapsed=!$scope.isCollapsed;
		};


	};

	return directive;

});
