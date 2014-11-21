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
        .controller('LicensesController',
                function($scope, RestService) {  
                    $scope.licensesFromMelwin = [];
                    $scope.licenseToEditId = {};
                    $scope.addOrEditButtonText = "Lagre ny lisens";
                    $scope.addOrEditHeaderText = "Ny lisens:";           
                    
                    function getLicensesFromMelwin() {
                                RestService.getLicenses()
                                        .success(function(licenses) {
                                            $scope.licensesFromMelwin = licenses;
                                        })
                                        .error(function(error) {
                                            $scope.status = 'Fikk ikke hentet lokasjoner fra databasen: ' + error.message;
                                        });
                            }
                    getLicensesFromMelwin();
                    
                    $scope.$watch(function() {
                            return $scope.licenseToEditId.melwinId;
                    }, function() {
                        for (var i = 0; i < $scope.licensesFromMelwin.length; i++) {
                            if ($scope.licenseToEditId.melwinId == $scope.licensesFromMelwin[i].melwinId) {
                                $scope.licenseToEdit = $scope.licensesFromMelwin[i];
                                $scope.addOrEditButtonText = "Lagre endringer";
                                $scope.addOrEditHeaderText = "Endre " + $scope.licenseToEdit.licenseName + ":";
                            }
                        }
                        ;
                    }, true);
                    
                    $scope.newLicenseButton = function(){
                      $scope.licenseToEdit = {};
                      $scope.licenseToEditId = {};
                      $scope.addOrEditButtonText = "Lagre ny lisens";
                      $scope.addOrEditHeaderText = "Ny lisens:";  
                    };
                    $scope.saveNewLicense = function() {                     
                        RestService.saveLicense($scope.licenseToEdit);
                        $scope.licensesFromMelwin.push($scope.licenseToEdit);
                    };
                    $scope.updateLicense = function() {        
                        RestService.updateLicense($scope.licenseToEdit);
                        $scope.licenses = [];
                        getLicensesFromMelwin();
                    };
                    $scope.saveChanges = function(){
                      if($scope.licenseToEdit.id == null)
                          $scope.saveNewLicense();
                      
                      else
                          $scope.updateLicense();
                    };
                });
