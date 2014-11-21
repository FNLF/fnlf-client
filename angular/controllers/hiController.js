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
        .controller('HiController',
                function($scope, RestService, DataService, $location) {
                    $scope.anomaly = DataService.getSelectedAnomaly();
                    getAnomalies();

                    function getAnomalies() {
                        RestService.getAnomalies()
                                .success(function(anomalies) {
                                    $scope.anomalies = anomalies;
                                })
                                .error(function(error) {
                                    $scope.status = 'Fikk ikke hentet avvik fra databasen: ' + error.message;
                                });
                    };
                    
                    $scope.showAnomaly = function(anomaly){
                        DataService.setSelectedAnomaly(anomaly);
                        $location.path('/hi/2');
                    };
                    
                    $scope.getPersonById = function(id) {
                        for (var i = 0; i < $scope.anomaly.involvedPersons.length; i++) {
                            if ($scope.anomaly.involvedPersons[i].id == id) {
                                return $scope.anomaly.involvedPersons[i];
                            }
                        }
                    };
                });
