
angular.module('anomalyApp')
        .controller('LoginController', function($scope, $rootScope, $location, $cookieStore, UserService) {

            $scope.login = function() {
                UserService.authenticate($scope.username,$scope.password,$scope.rememberMe);
            };
        });