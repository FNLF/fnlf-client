angular.module('reportingApp').directive('involvedpersondetails', function (RestService) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "involved/directives/involvedpersondetails.html";

	directive.scope = {
		observation: '=',
		acl: '='
	};
	
	directive.controller = function ($scope) {
		$scope.open = {};
		
		
		$scope.jumptypes = [];
		
		var getJumpTypes = function () {
			RestService.getJumpTypes()
				.then(function (data) {
					$scope.jumptypes = data._items;
				});
		};
		getJumpTypes();
		
		$scope.licensesFromMelwin = [];
		
		var getLicensesFromMelwin = function () {
			RestService.getLicenses()
				.then(function (data) {
					$scope.licensesFromMelwin = data._items;
				});
		};
		getLicensesFromMelwin();
		
	};
	
	directive.link = function ($scope, element, attrs) {
	
	};

	return directive;
});




