(function () {

	var organization = function (RestService, $rootScope, $window) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = '/app/obs/observation/directives/organization/organization.html';
		directive.scope = {
			observation: '=',
			acl: '='
		};

		directive.controller = function ($scope, $rootScope, $location) {


		};
		
		
		directive.link = function ($scope, element, attrs) {

			


			$scope.personSelected = function ($item, $model) {

			};

			$scope.personRemoved = function ($item, $model) {

			};
			$scope.personsFromDb=[];
			$scope.getPersonsByName = function (name) {
					RestService.getUserByName(name)
						.then(function (response) {
							$scope.personsFromDb = response._items;
						});
			};

			var nonMemberId = function(){
				return Math.floor(Math.random()*10000)*-1;
			};

			$scope.tagTransform = function(itemText){
				return {fullname:itemText,tmpname:itemText,id:nonMemberId()}
			};

		};

		return directive;
	};

	angular.module('reportingApp').directive('organization', organization);

})();