(function () {

	var multipersonselector = function (RestService,Functions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/shared/directives/multipersonselector.html";

		directive.scope = {
			model: '=',
			noun: '@',
			acl: '=',
		};

		directive.link = function ($scope, element, attrs) {

			$scope.onSelect = function (item, model) {
				$scope.model.push(item);
			};

			$scope.onRemove = function(item,model){
				var index = $scope.model.indexOf(model);
				if (index > -1) {
					$scope.model.splice(index,1);
				}
			};


			$scope.personsFromDb = [];

			$scope.getPersonsByName = function (name) {
				RestService.getUserByName(name)
					.then(function (response) {
						var persons = {};
						$scope.model.forEach(function(m){
							persons[m.id]=true;
						});

						$scope.personsFromDb = response._items.filter(function(p){return !persons[p.id]});
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
	};

	angular.module('fnlf-directives').directive('multipersonselector', multipersonselector);

})();


