angular.module('reportingApp').directive('involvedpersonselector', function (RestService, $aside, $rootScope, $window) {
		var directive = {};

		directive.restrict = 'E';

		directive.templateUrl= '/app/obs/persondetails/directives/involvedpersonselector.html';


		directive.scope = {
			observation: '=',
			acl: '='
		};

		directive.controller = function ($scope, $rootScope, $location, $aside, RestService) {

			$scope.openInvolvedAside = function () {
				$location.path('/observation/modal-route', false);
				$scope.involvedAside = $aside({
					scope: $scope,
					title: 'Involverte personer',
					//content: 'My Content', //Static custom content
					show: true,
					contentTemplate: '/app/obs/persondetails/directives/involvedpersonselector.html',
					template: '/shared/partials/aside.html',
					placement: 'full-left',
					container: 'body',
					backdrop: 'static',
					animation: 'am-slide-left'
				});
			};

			// Needs to manually close aside on back button
			$rootScope.$on('$routeChangeStart', function (event, next, current) {
				if ($scope.involvedAside) {
					if ($scope.involvedAside.$scope.$isShown && $location.path().indexOf('/modal-route') == -1) {
						$scope.involvedAside.hide();
					}
				}
			});

			$scope.$on('aside.hide', function () {
				if ($location.path().indexOf('/modal-route') != -1) {
					$window.history.back();
				}
			});

			$scope.onSelect = function (item, model) {
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
