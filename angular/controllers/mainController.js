/**
*
* @author: Tore Buer, s180346
* @author: Eivind Jacobsen, s173466
* @author: Morten Kristoffersen, s169440
*
* @since may.26.2014
*
*/
angular.module('anomalyApp')
        .controller('MainController', function($scope, $location, DataService, RestService) {
            $scope.service = RestService;
            $scope.goToPage = function(url){
                $location.path(url);
            };
            $scope.anomaly = DataService.readAnomaly();
                        
            $scope.getPersonById = function(id) {
                        for (var i = 0; i < $scope.anomaly.involvedPersons.length; i++) {
                            if ($scope.anomaly.involvedPersons[i].id == id) {
                                return $scope.anomaly.involvedPersons[i];
                            }
                        }
                    };
            $scope.saveAnomaly = function() {
                        RestService.saveAnomaly($scope.anomaly);
                        $scope.anomaly = {};
                        DataService.resetSelectedAnomaly();
                        $location.path('/hi/1');
                    };
        });