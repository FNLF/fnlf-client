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
angular.module('reportingApp')
        .controller('IncidentController',
                function($scope, DataService, $location, RestService) {
                    $scope.service = DataService;
                    $scope.incident = {};
                    $scope.incidentGroups = [];
                    $scope.personsSelected = getPersonsInvolvedInIncident();
                    $scope.addOrEditIncident = "Legg til hendelse";  
                    
                    $scope.$watch('service.readAnomaly()', function(newValue) {
                        $scope.anomaly = newValue;
                    });

                    $scope.deleteIncident = function(id){
                      DataService.deleteIncident(id);  
                      $scope.incident = {};
                    };

                    $scope.$watch(function() {
                        return $scope.personsSelected;
                    }, function() {
                        var persons = [];
                        angular.forEach($scope.personsSelected, function(selected, id) {
                            selected && persons.push(id);
                        });
                        $scope.incident.involvedPersonsId = persons;
                    }, true);

                    $scope.getPersonById = function(id) {
                        for (var i = 0; i < $scope.anomaly.involvedPersons.length; i++) {
                            if ($scope.anomaly.involvedPersons[i].id == id) {
                                return $scope.anomaly.involvedPersons[i];
                            }
                        }
                    };

                    $scope.isChecked = function(id) {
                        if ($scope.incident.involvedPersonsId != null) {
                            var i = $scope.incident.involvedPersonsId.length;
                            while (i--) {
                                if ($scope.incident.involvedPersonsId[i] == id){
                                    return true;
                                }    
                            }
                        }
                        return false;
                    };

                    function getPersonsInvolvedInIncident() {
                        if ($scope.incident.involvedPersonsId == null) {
                            $scope.incident.involvedPersonsId = new Array();
                        }
                        return $scope.incident.involvedPersonsId;
                    };

                    $scope.showForms = function(){
                        $scope.hideAllForms();
//                  Add these lines to let users fill out information about gear
//                        if($scope.incidentTypeSelected != null){
//                            var x = parseInt($scope.incidentTypeSelected);
//                            switch(true){
//                                case x<1: $scope.showHarnessForm = true;
//                                    break;
//                                case x<2: $scope.showInjuryForm = true;
//                                    break;
//                                case x<3: $scope.showMainCanopyForm = true;
//                                    break;
//                                case x<4: $scope.showReserveCanopyForm = true;
//                                    break;
//                                case x<5: $scope.showAADForm = true;
//                                    break;
//                                case x<6: $scope.showMalfunctionForm = true;
//                                    break;
//                            }
//                        }
                    };
                    
                    $scope.hideAllForms = function(){
                       $scope.showMalfunctionForm = false;
                       $scope.showInjuryForm = false;
                       $scope.showMainCanopyForm = false;
                       $scope.showReserveCanopyForm = false;
                       $scope.showAADForm = false;
                       $scope.showHarnessForm = false;
                    };

                    $scope.editIncident = function(timelineIndex) {
                        $scope.incident = DataService.getIncidentByTimelineIndex(timelineIndex);
                        $scope.addOrEditIncident = "Endre hendelse #" + $scope.incident.timelineIndex;
                    };

                    $scope.addIncident = function(incident) {
                        $scope.addOrEditIncident = "Legg til hendelse";
                        DataService.addIncident(incident);
                        $scope.personsSelected = [];
                        getIncidentTypes();
                        $scope.incident = {};
                        $scope.incidentTypeSelected = null; 
                    };

                    $scope.$watch(function() {
                        return $scope.incidentTypeSelected  ;
                    }, function() {
                        for (var i = 0; i < $scope.incidentTypes.length; i++) {
                            if ($scope.incidentTypeSelected == $scope.incidentTypes[i].id) {
                                $scope.incident.incidentType = $scope.incidentTypes[i];
                            }
                        }
                        ;
                    }, true);

                    $scope.saveAnomaly = function() {
                        DataService.updateAnomaly($scope.anomaly);
                        $location.path('/report/4');
                    };
                    
                    function getIncidentTypes() {
                        $scope.incidentTypes = [];
                        RestService.getIncidentTypes()
                                .success(function(incidentTypes) {
                                    $scope.incidentTypes = incidentTypes;
                                    findIncidentGroups();
                                })
                                .error(function(error) {
                                    $scope.status = 'Fikk ikke hentet hendelser fra databasen: ' + error.message;
                                });
                    }
                    getIncidentTypes();
                    var found = false;
                    
                    function findIncidentGroups(){
                      for(var i in $scope.incidentTypes){
                          for(var j in $scope.incidentGroups){
                              if($scope.incidentTypes[i].group == $scope.incidentGroups[j]){
                                  found = true;
                              }
                          }
                          if(!found){
                              $scope.incidentGroups.push($scope.incidentTypes[i].group);
                              
                          }
                          found = false;
                      }
                    };              
                    
                    $scope.saveNewIncident = function() {
                        $scope.incidentType.active = true;
                        RestService.saveIncidentType($scope.incidentType)
                                .success(function(returnedIncidentType){
                                            getIncidentTypes();
                                            $scope.incidentType = {};
                                        })
                                        .error(function(error){
                                           //Handle error 
                                        });
                    };
 
                });
})();