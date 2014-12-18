/**
*
* @author: Tore Buer, s180346
* @author: Eivind Jacobsen, s173466
* @author: Morten Kristoffersen, s169440
*
* @since may.26.2014
*
*/
(function(){

angular.module('anomalyApp')
        .controller('AdminController',
                function($scope, RestService) {
                    $scope.chiefInstructors = [];

                    $scope.locationSelected = {};
                    $scope.locations = [];

                    getLocations();

                    function getLocations() {
                        RestService.getLocations()
                                .success(function(locations) {
                                    $scope.locations = locations;
                                })
                                .error(function(error) {
                                    $scope.status = 'Fikk ikke hentet steder fra databasen: ' + error.message;
                                });
                    }

                    $scope.addOrEditLocationText = "Lagre";

                    $scope.saveNewLocation = function() {
                        RestService.saveLocation($scope.locationToEdit);
                        getLocations();
                    };
                    $scope.updateLocation = function() {
                        RestService.updateLocation($scope.locationToEdit);
                        getLocations();
                    };
                    $scope.saveLocation = function() {
                        if ($scope.locationToEdit.id == null)
                            $scope.saveNewLocation();

                        else
                            $scope.updateLocation();
                    };

                    $scope.deleteLocation = function() {
                        RestService.deleteLocation($scope.locationToEdit)
                                .success(function() {
                                    $scope.locationToEdit = {};
                                    getLocations();
                                });

                    };

                    function getJumpTypes() {
                        RestService.getJumpTypes()
                                .success(function(jumptypes) {
                                    $scope.jumpTypes = jumptypes;
                                })
                                .error(function(error) {
                                    $scope.status = 'Fikk ikke hentet hopptyper fra databasen: ' + error.message;
                                });
                    }
                    getJumpTypes();

                    $scope.newJumpTypeButton = function() {
                        $scope.jumpTypeToEdit = {};
                    };

                    $scope.editJumpType = function(jumpType) {
                        $scope.jumpTypeToEdit = jumpType;
                    };

                    $scope.deleteJumpType = function() {
                        RestService.deleteJumpType($scope.jumpTypeToEdit)
                                .success(function() {

                                })
                                .error(function(error) {
                                    $scope.status = 'Fikk ikke slettet hopptype fra databasen: ' + error.message;
                                });
                    };
                });
})();