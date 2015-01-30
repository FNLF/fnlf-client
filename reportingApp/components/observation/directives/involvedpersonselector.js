(function () {

	var involvedpersonselector = function (RestService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "reportingApp/components/observation/directives/involvedpersonselector.html";

		directive.scope = {
			observation: '='
		};

		directive.link = function ($scope, element, attrs) {

			$scope.personsFromDb = [].concat($scope.observation.involved);

			$scope.personSelected = function ($item, $model) {

			};

			$scope.personRemoved = function ($item, $model) {

			};

			$scope.getPersonsByName = function (name) {
				if(name.length>2){
					RestService.getUserByName(name)
					.success(function (response) {
						$scope.personsFromDb = $scope.observation.involved.concat(response._items);
					});
				}
			};

			$scope.tagTransform = function(itemText){

				return {fullname:itemText,id:0};
			}

		};

		return directive;
	};

	angular.module('reportingApp').directive('involvedpersonselector', involvedpersonselector);

})();