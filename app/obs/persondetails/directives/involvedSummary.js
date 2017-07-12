angular.module('reportingApp').directive('involvedSummary', function (RestService) {

	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl= '/app/obs/persondetails/directives/involvedSummary.html';

	directive.scope = {
		observation: '=',
		acl: '='
	};

	directive.link = function ($scope, element, attrs) {

		$scope.oninvolvedselected=function(user){

			$scope.getUserDetails(user);

		};

		$scope.getUserDetails = function (user) {
			RestService.getUserDetails(user.id)
				.then(function (data) {
					user.membership = data.membership;
					user.licenses = data.licenses;
				
				});
		};

	};

	return directive;
});
