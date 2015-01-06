(function () {
	'use strict';
	angular.module('content', [])

		.controller('ContentController', function ($scope, $http, authService, $rootScope, GlobalsService) {

			$scope.publicContent = [];
			$scope.restrictedContent = [];

			$scope.publicAction = function () {
				$http.get(GlobalsService.get('baseUrl') + 'users/' + $scope.member).success(function (response) {
					$scope.publicContent.push(response);
				});
			}

			$scope.restrictedAction = function () {
				$http.get(GlobalsService.get('baseUrl') + 'users/' + $scope.member).success(function (response) {
					// this piece of code will not be executed until user is authenticated
					$scope.restrictedContent.push(response);
				});
			}

		});
})();