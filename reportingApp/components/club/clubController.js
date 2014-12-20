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
        .controller('ClubController',
                function($scope, RestService, DataService) {
                    $scope.service = DataService;
                    $scope.clubSelected = DataService.getAnomalyClub();
                    $scope.clubToEditId = {};
                    $scope.addOrEditButtonText = "Lagre ny klubb";
                    $scope.addOrEditHeaderText = "Ny klubb:";
                    $scope.clubs = [];                    
                    $scope.clubToEdit = {};
                    
                    getClubs();

                    function getClubs() {
                        RestService.getClubs()
                                .success(function(response) {
                                    $scope.clubs = response._items;
                                })
                                .error(function(error) {
                                    $scope.status = 'Fikk ikke hentet klubber fra databasen: ' + error.message;
                                });
                    };
                    
                    $scope.saveNewClub = function() {                     
                        RestService.saveClub($scope.clubToEdit);
                        $scope.clubs.push($scope.newClub);
                    };
                    $scope.updateClub = function() {        
                        RestFactory.updateClub($scope.clubToEdit)
                                .success(function(club){
                                    $scope.clubs = [];
                                    getClubs();
                                    $scope.clubToEdit = club;
                                    $scope.addOrEditButtonText = "Lagre ny klubb";
                                    $scope.addOrEditHeaderText = "Ny klubb:";                                      
                        })
                                .error(function(error){
                           //Handle error
                        });
                    };          
                    
                    $scope.$watch(function() {
                        return $scope.clubSelected.melwinId;
                    }, function() {
                        for (var i = 0; i < $scope.clubs.length; i++) {
                            if ($scope.clubSelected.melwinId === $scope.clubs[i].melwinId) {
                                DataService.setAnomalyClub($scope.clubs[i]);
                            }
                        }
                        ;
                    }, true);
                    
                    $scope.newClubButton = function(){
                      $scope.deleteClub();
                      $scope.clubToEdit = null;
                      $scope.clubToEditId = null;
                      $scope.addOrEditButtonText = "Lagre ny klubb";
                      $scope.addOrEditHeaderText = "Ny klubb:";  
                    };  
                    
                    $scope.$watch(function() {
                        return $scope.clubToEditId.melwinId;
                    }, function() {
                        for (var i = 0; i < $scope.clubs.length; i++) {
                            if ($scope.clubToEditId.melwinId === $scope.clubs[i].melwinId) {
                                $scope.clubToEdit = $scope.clubs[i];
                                $scope.addOrEditButtonText = "Lagre endringer";
                                $scope.addOrEditHeaderText = "Endre " + $scope.clubToEdit.name + ":";
                            }
                        };
                    }, true);
                    
                    $scope.$watch('service.readAnomaly()', function(newValue) {
                        $scope.anomaly = newValue;
                    });

                });
})();