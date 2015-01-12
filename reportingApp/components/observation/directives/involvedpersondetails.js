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

		$scope.getJumpTypes = function(){
			RestService.getJumpTypes()
				.success(function(data){
					$scope.jumptypes = data._items;
				});
		};
		$scope.getJumpTypes();

	};

	return directive;
});