angular.module('reportingApp').directive('involvedpersonselector', function (RestService, $rootScope, $window) {
		var directive = {};

		directive.restrict = 'E';

		directive.templateUrl= '/app/obs/involved/directives/involvedpersonselector.html';


		directive.scope = {
			observation: '=',
			acl: '='
		};

		directive.controller = function ($scope, $rootScope, $location, RestService) {


			$scope.onSelect = function (item, model) {
				if(item.id && item.id > 0){
					RestService.getUser(item.id)
						.then(function (user) {
							var settings = user.settings;
							if (settings.total_jumps) {
								item.numberOfJumps = settings.total_jumps;
							}
							if (settings.gear) {
								item.gear = settings.gear;
							}
						});
				}

				item.open = true;
			};

		};

		directive.link = function ($scope, element, attrs) {


			$scope.personsFromDb = [];

			$scope.getPersonsByName = function (name) {
				RestService.getUserByName(name)
					.then(function (response) {
						$scope.personsFromDb = response._items;
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
	}
);
