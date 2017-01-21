angular.module('reportingApp').directive('involvedperson', function (RestService) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "persondetails/directives/involvedperson.html";

	directive.scope = {
		person: '=',
		jumptypes: '=',
		licensesFromMelwin: '=',
		acl: '='

	};

	directive.link = function ($scope, element, attrs) {

		if ($scope.person.id) {
			RestService.getUserDetails($scope.person.id)
				.then(function (data) {
					$scope.person.membership = data.membership;
					$scope.person.licenses = data.licenses;
				});
		}


		$scope.personsFromDb = [];
		$scope.loading=false;

		$scope.getPersonsByName = function (name) {
			$scope.loading=true;
			RestService.getUserByName(name)
				.then(function (response) {
					$scope.personsFromDb = response._items;
					$scope.loading=false;
				});
		};

		var nonMemberId = function () {
			return Math.floor(Math.random() * 10000) * -1;
		};

		$scope.tagTransform = function (itemText) {
			return {fullname: itemText, tmpname: itemText, id: nonMemberId()}
		};

	};

	return directive;
});
