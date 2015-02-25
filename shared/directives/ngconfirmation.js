/*
 * Simple confirm dialogue directive for angular
 * ng-confirm-message="Er du sikker at du vil slette bildet?" ng-confirm-click="removeFile(fileid)"
 */
'use strict';
angular.module('angular-confirm', []).directive('ngConfirmClick', function() {
	return {
		priority : 100,
		restrict : 'A',

		link : function(scope, element, attrs) {
			element.bind('click', function(e) {
				e.stopPropagation(); // In case you cancel and don't want
										// events to be propagated.
				var message = attrs.ngConfirmMessage;
				if (message && confirm(message)) {
					scope.$apply(attrs.ngConfirmClick);
				}
			});
		}
	};
});
