(function(){

	var LoginController = function($scope, $rootScope, $location, $cookieStore, UserService) {
		$scope.rememberMe=true;
        $scope.username = $cookieStore.get('username');

		$scope.login = function() {
        	UserService.authenticate($scope.username,$scope.password,$scope.rememberMe);
		};
	}

	angular.module('anomalyApp').controller('LoginController',LoginController );
})();
