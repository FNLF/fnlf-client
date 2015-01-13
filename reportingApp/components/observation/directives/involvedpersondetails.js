angular.module('reportingApp').directive('involvedpersondetails', function (RestService) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "reportingApp/components/observation/directives/involvedpersondetails.html";

	directive.scope = {
		observation: '='
	};

	directive.link = function ($scope, element, attrs) {
		$scope.getUserDetails = function (user){
			RestService.getUserDetails(user.id)
				.success(function(data){
					user.membership = data.membership;
					user.licenses = data.licenses;
				});
		};

		$scope.jumptypes = [];

		var getJumpTypes = function(){
			RestService.getJumpTypes()
				.success(function(data){
					$scope.jumptypes = data._items;
				});
		};
		getJumpTypes();

		$scope.licensesFromMelwin = [];

		var getLicensesFromMelwin = function(){
			RestService.getLicenses()
				.success(function(data){
					$scope.licensesFromMelwin = data._items;
				});
		};
		getLicensesFromMelwin();

	};

	return directive;
});