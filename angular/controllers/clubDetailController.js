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
        .controller('ClubDetailController',
                function($scope, RestService) {
                    $scope.addOrEditClubText = "Ny klubb";
                    $scope.addOrEditClubButton = "Lagre ny klubb";
                    getchiefInstructors();

                    $scope.getChiefInstructor = function(melwinId) {
                        RestService.getPerson(melwinId)
                                .success(function(person) {
                                    $scope.chiefInstructor = person;
                                })
                                .error(function() {
                                    $scope.chiefInstructorStatus = "Feil ved henting fra database";
                                });
                    };

                    $scope.editClub = function(club) {
                        $scope.addOrEditClubText = "Endre klubb";
                        $scope.addOrEditClubButton = "Lagre endringer";
                        $scope.clubToEdit = club;
                    };
                    $scope.newClubButton = function() {
                        $scope.clubToEdit = {};
                    };

                    function getchiefInstructors() {
                        RestService.getPersons()
                                .success(function(persons) {
                                    $scope.chiefInstructors = persons;
                                    $scope.showLoader = false;

                                })
                                .error(function(error) {
                                    $scope.personStatus = 'Fikk ikke hentet personer fra databasen: ' + error;
                                });
                    };
                    $scope.$watch(function() {
                        return $scope.chiefInstructorSelected;
                    }, function() {
                        for (var i = 0; i < $scope.chiefInstructors.length; i++) {
                            if ($scope.chiefInstructorSelected == $scope.chiefInstructors[i].melwinId) {
                                $scope.clubToEdit.chiefInstructorMelwinId = $scope.chiefInstructors[i].melwinId;
                            }
                        };
                    }, true);

                    getClubs();

                    function getClubs() {
                        RestService.getClubs()
                                .success(function(clubs) {
                                    $scope.clubs = clubs;
                                })
                                .error(function(error) {
                                    $scope.status = 'Fikk ikke hentet klubber fra databasen: ' + error.message;
                                });
                    };

                    $scope.deleteClub = function() {
                        RestService.deleteClub($scope.clubToEdit)
                                .success(function() {
                                    $scope.clubs = [];
                                    getClubs();
                                });
                    };

                    $scope.saveClub = function() {
                        if ($scope.clubToEdit.id == null) { 
                            $scope.saveNewClub();
                            $scope.clubToEdit = {};
                        }
                        else 
                            $scope.updateClub();
                        $scope.clubToEdit = {}; 
                    };
                });
})();