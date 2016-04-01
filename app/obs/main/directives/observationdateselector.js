/**
 * 
 * Using https://github.com/zhaber/datetimepicker
 */

angular.module('reportingApp').directive('observationdateselector', function ($timeout) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "main/directives/observationdateselector.html";

	directive.scope = {
		observation: '=',
		acl: '='
	};

	directive.link = function ($scope, element, attrs) {

		if(typeof $scope.observation.when == 'undefined') {
			$scope.observation.when = new Date();
		}
		$scope.open = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened = true;
		};

		$scope.dateOptions = {
				startingDay: 1,
				showWeeks: true
		};
		
		$scope.format = 'yyyy-MM-dd HH:mm';
		
		$scope.maxDate = new Date();
		$scope.minDate = new Date(2011,10,30);
		/** TIME **/
		$scope.hstep = 1;
		$scope.mstep = 1;

	};

	return directive;
});