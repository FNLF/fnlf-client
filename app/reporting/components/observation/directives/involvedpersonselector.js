angular.module('reportingApp').directive('involvedSummary', function () {

	var directive = {};

	directive.restrict = 'E';
	directive.template = '<span ng-repeat="p in observation.involved"><span class="label label-primary">{{p.fullname}} </span> &nbsp;</span>';

	directive.scope = {
		observation: '='
	};

	directive.link = function ($scope, element, attrs) {

	};

	return directive;
});

(function () {

	var involvedpersonselector = function (RestService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "components/observation/directives/involvedpersonselector.html";

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
					RestService.getUserByName(name)
					.success(function (response) {
						$scope.personsFromDb = [].concat($scope.observation.involved,response._items);
					});
			};

			$scope.tagTransform = function(itemText){

				return {fullname:itemText,id:0};
			}

		};

		return directive;
	};

	angular.module('reportingApp').directive('involvedpersonselector', involvedpersonselector);

})();