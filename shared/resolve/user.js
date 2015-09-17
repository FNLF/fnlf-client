angular.module('resolve')
        .directive('resolveuser', function ($http, $q, ResolveService) {

                var directive = {};

                directive.restrict = 'E';
                directive.template = '<span>{{::firstname}} {{::lastname}}</span>';

                directive.scope = {
                        userid: '=',
                        tmpname: '='
                };

                directive.link = function ($scope, element, attrs) {
                        if ($scope.userid > 0) {
                                ResolveService.getUser($scope.userid).then(
                                        function (user) {
                                                $scope.firstname = user.firstname;
                                                $scope.lastname = user.lastname;
                                        });
                        }
                        else{
                                $scope.firstname = 'Anonymisert';
                                $scope.lastname = '';
                                if($scope.tmpname){
                                        $scope.firstname = $scope.tmpname;
                        $scope.lastname = '';
                                }

                        }

                };
                return directive;
        });