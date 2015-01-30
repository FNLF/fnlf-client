(function () {

	var organization = function (RestService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "reportingApp/components/observation/directives/organization.html";

		directive.scope = {
			observation: '='
		};

		directive.link = function ($scope, element, attrs) {

			$scope.existing = [];
		/*
				$scope.existing = $scope.existing.concat($scope.organization.hl);
			$scope.existing = $scope.existing.concat($scope.organization.hm);
			$scope.existing = $scope.existing.concat($scope.organization.hfl);
		*/
				$scope.personsFromDb = [].concat($scope.existing);

			$scope.personSelected = function ($item, $model) {

			};

			$scope.personRemoved = function ($item, $model) {

			};

			$scope.getPersonsByName = function (name) {
				if(name.length>2){
					RestService.getUserByName(name)
						.success(function (response) {
							$scope.personsFromDb = $scope.existing.concat(response._items);
						});
				}
			};

			$scope.tagTransform = function(itemText){

				return {fullname:itemText,id:0};
			}

		};

		return directive;
	};

	angular.module('reportingApp').directive('organization', organization);

})();