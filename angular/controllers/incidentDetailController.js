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
        .controller('IncidentDetailController',
                function($scope, RestService) {
                    
                    $scope.addOrEditIncidentTypeButton = "Lagre ny";
                    function getIncidentTypes() {
                        RestService.getIncidentTypes()
                                .success(function(incidentTypes) {
                                    $scope.incidentTypes = incidentTypes;
                                })
                                .error(function(error) {
                                    $scope.status = 'Fikk ikke hentet hendelsestyper fra databasen: ' + error.message;
                                });
                    }
                    ;
                    getIncidentTypes();
                    
                    $scope.$watch(function() {
                        return $scope.incidentTypeToEditId;
                    }, function() {
                        for (var i = 0; i < $scope.incidentTypes.length; i++) {
                            if ($scope.incidentTypeToEditId == $scope.incidentTypes[i].id) {
                                $scope.incidentTypeToEdit = $scope.incidentTypes[i];
                                return;
                            }
                        };
                    }, true);

                    $scope.newIncidentTypeButton = function() {
                        $scope.incidentTypeToEdit = {};
                        $scope.incidentTypeToEditId = {};
                        $scope.addOrEditIncidentTypeButton = "Lagre ny";
                        $scope.addOrEditHeaderText = "Ny hendelse:";
                    };
                    $scope.saveNewIncidentType = function() {
                        RestService.saveIncidentType($scope.incidentTypeToEdit);
                        $scope.incidentTypes.push($scope.incidentTypeToEdit);
                    };
                    $scope.updateIncidentType = function() {
                        RestService.updateIncidentType($scope.incidentTypeToEdit);
                        $scope.incidentTypes = [];
                        getIncidentTypes();
                    };
                    $scope.editIncidentType = function(){
                      $scope.addOrEditIncidentTypeButton = "Lagre endringer";  
                    };
                    $scope.saveChanges = function() {
                        if ($scope.incidentTypeToEdit.id == null)
                            $scope.saveNewIncidentType();

                        else 
                            $scope.updateIncidentType();
                    };
                    $scope.deleteIncidentType = function() {
                        if ($scope.incidentTypeToEdit.id == null) { 
                            $scope.incidentTypeSelected = {};
                        }
                        else { 
                            RestService.deleteIncidentType($scope.incidentTypeToEdit.id);
                            $scope.incidentTypes = [];
                            getIncidentTypes();
                            $scope.incidentTypeSelected = {};
                        }
                    };
                });