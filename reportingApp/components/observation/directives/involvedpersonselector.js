(function () {

	var involvedpersonselector = function (PersonQueryService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "reportingApp/components/observation/directives/involvedpersonselector.html";

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
				PersonQueryService.getPersonsByName(name)
				.success(function(response){
					$scope.personsFromDb = response.data._items;
				});
			};

		};

		return directive;
	};

	angular.module('reportingApp').directive('involvedpersonselector', involvedpersonselector);

})();