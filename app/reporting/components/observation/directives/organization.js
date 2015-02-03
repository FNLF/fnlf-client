(function () {

	var organization = function (RestService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "components/observation/directives/organization.html";

		directive.scope = {
			observation: '='
		};

		directive.link = function ($scope, element, attrs) {



			$scope.personsFromDb = [];

			$scope.personSelected = function ($item, $model) {

			};

			$scope.personRemoved = function ($item, $model) {

			};

			$scope.getPersonsByName = function (name) {
					RestService.getUserByName(name)
						.success(function (response) {
							$scope.existing = [].concat($scope.observation.organization.hl,$scope.observation.organization.hm,$scope.observation.organization.hfl);
							$scope.personsFromDb = $scope.existing.concat(response._items);
						});

			};

			$scope.tagTransform = function(itemText){

				return {fullname:itemText,id:0};
			}

		};

		return directive;
	};

	angular.module('reportingApp').directive('organization', organization);

})();