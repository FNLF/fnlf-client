angular.module('reportingApp').directive('involvedpersondetails', function (RestService) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "involved/directives/involvedpersondetails.html";

	directive.scope = {
		observation: '=',
		acl: '='
	};

	directive.link = function ($scope, element, attrs) {

		$scope.open = {};

		$scope.getUserDetails = function (user) {
			RestService.getUserDetails(user.id)
				.then(function (data) {
					user.membership = data.membership;
					user.licenses = data.licenses;
				});
		};

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

	return directive;
});




