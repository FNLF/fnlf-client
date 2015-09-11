



angular.module('reportingApp').directive('involvedpersondetails', function (RestService) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "components/observation/directives/involvedpersondetails.html";

	directive.scope = {
		observation: '='
	};

	directive.link = function ($scope, element, attrs) {

		$scope.open={};

		$scope.getUserDetails = function (user){
			RestService.getUserDetails(user.id)
				.then(function(data){
					user.membership = data.membership;
					user.licenses = data.licenses;
				});
		};

		$scope.jumptypes = [];

		var getJumpTypes = function(){
			RestService.getJumpTypes()
				.then(function(data){
					$scope.jumptypes = data._items;
				});
		};
		getJumpTypes();

		$scope.licensesFromMelwin = [];

		var getLicensesFromMelwin = function(){
			RestService.getLicenses()
				.then(function(data){
					$scope.licensesFromMelwin = data._items;
				});
		};
		getLicensesFromMelwin();

	};

	return directive;
});


angular.module('reportingApp').directive('involvedperson', function (RestService) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "components/observation/directives/involvedperson.html";

	directive.scope = {
		person: '=',
		jumptypes: '=',
		licensesFromMelwin: '='

	};

	directive.link = function ($scope, element, attrs) {

		if($scope.person.id){
			RestService.getUserDetails($scope.person.id)
				.then(function(data){
					$scope.person.membership = data.membership;
					$scope.person.licenses = data.licenses;
				});
		}
	};

	return directive;
});

angular.module('reportingApp').directive('involvedpersonsummary', function (RestService) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "components/observation/directives/involvedpersonsummary.html";

	directive.scope = {
		person: '='
	};

	directive.link = function ($scope, element, attrs) {


	};

	return directive;
});