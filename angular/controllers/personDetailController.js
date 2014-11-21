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
        .controller('PersonDetailController',
                function($scope, RestService, DataService) {
                    $scope.licensesFromMelwin = DataService.getLicensesFromMelwin();
                    getJumpTypes();
                    $scope.service = DataService;
                    $scope.jumptypeSelected = getJumpType();
                    $scope.licensesSelected = getPersonsLicenses();
                    $scope.jumptypes = [];
                    
                    $scope.$watch('service.readAnomaly()', function(newValue) {
                        $scope.anomaly = newValue;
                    });

                    $scope.$watch(function() {
                        return $scope.licensesSelected;
                    }, function() {
                        var licenses = [];
                        angular.forEach($scope.licensesSelected, function(selected, index) {
                            selected && licenses.push(getLicenseByIdOrIndex(selected.id, index));
                        });
                        $scope.person.licenses = licenses;
                    }, true);

                    $scope.isChecked = function(license) {
                        var id = "id";
                        var i = $scope.person.licenses.length;
                        while (i--) {
                            if ($scope.person.licenses[i] != null && $scope.person.licenses[i][id] == license[id])
                                return true;
                        }
                        return false;
                    };
                    function getLicenseByIdOrIndex(id, index) {
                        if (id == null) {
                            return $scope.licensesFromMelwin[index - 1];
                        }
                        else {
                            return getLicenseById(id);
                        }
                    };

                    function getLicenseById(id) {
                        for (var i = 0; i < $scope.licensesFromMelwin.length; i++) {
                            if ($scope.licensesFromMelwin[i].id == id) {
                                return $scope.licensesFromMelwin[i];
                            }
                        }
                    };

                    function getPersonsLicenses() {
                        if ($scope.person.licenses != null) {
                            return $scope.person.licenses;
                        }
                        return new Array();
                    };

                    $scope.$watch(function() {
                        return $scope.jumptypeSelected;
                    }, function() {
                        for (var i = 0; i < $scope.jumptypes.length; i++) {
                            if ($scope.jumptypeSelected == $scope.jumptypes[i].id) {
                                $scope.person.jumptype = $scope.jumptypes[i];
                                $scope.jumptypeSelected = $scope.jumptypes[i].id;
                                return;
                            }
                        };
                    }, true);

                    function getJumpType() {
                        if ($scope.person.jumptype == null) {
                            return {};
                        }
                        return $scope.person.jumptype.id;
                    };

                    function getInvolvedPersonById(id) {
                        for (var i = 0; i < $scope.anomaly.involvedPersons.length; i++) {
                            if ($scope.anomaly.involvedPersons[i].id == id) {
                                return $scope.anomaly.involvedPersons[i];
                            }
                        }
                    };

                    function getJumpTypes() {
                        RestService.getJumpTypes()
                                .success(function(jumptypes) {
                                    $scope.jumptypes = jumptypes;
                                })
                                .error(function(error) {
                                    $scope.status = 'Fikk ikke hentet hopptyper fra databasen: ' + error.message;
                                });
                    }
                });
