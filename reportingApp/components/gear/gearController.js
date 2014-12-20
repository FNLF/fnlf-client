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
        .controller('GearController',
                function($scope, RestService) {
                    $scope.manufacturers = [];
                    $scope.manufacturerToEditId = {};
                    $scope.mainCanopyManufacturer = {};
                    $scope.addOrEditButtonText = "Lagre ny produsent";
                    $scope.addOrEditHeaderText = "Ny produsent:"; 
                    $scope.showManufacturers = true;
                    $scope.mainCanopies = [];

                    function getManufacturers() {
                        RestService.getManufacturers()
                                .success(function(m) {
                                    $scope.manufacturers = m;
                                })
                                .error(function(error) {
                                    $scope.status = 'Fikk ikke hentet produsenter fra databasen: ' + error.message;
                                });
                    }
                    getManufacturers();

                    $scope.$watch(function() {
                        return $scope.manufacturerToEditId.id;
                    }, function() {
                        for (var i = 0; i < $scope.manufacturers.length; i++) {
                            if ($scope.manufacturerToEditId.id == $scope.manufacturers[i].id) {
                                $scope.manufacturerToEdit = $scope.manufacturers[i];
                                $scope.addOrEditButtonText = "Lagre endringer";
                                $scope.addOrEditHeaderText = "Endre " + $scope.manufacturerToEdit.name + ":";
                            }
                        };
                    }, true);

                    $scope.newManufacturerButton = function() {
                        $scope.manufacturerToEdit = {};
                        $scope.manufacturerToEditId = {};
                        $scope.addOrEditButtonText = "Lagre ny produsent";
                        $scope.addOrEditHeaderText = "Ny produsent:";
                    };
                    $scope.saveNewManufacturer = function() {
                        RestService.saveManufacturer($scope.manufacturerToEdit);
                        $scope.manufacturers.push($scope.manufacturerToEdit);
                    };
                    $scope.updateManufacturer = function() {
                        RestService.updateManufacturer($scope.manufacturerToEdit)
                                .success(function(){
                                    $scope.manufacturers = [];
                                    getManufacturers();
                                    $scope.manufacturerToEdit = {};
                                    $scope.manufacturerToEditId = {};
                                    
                        });
                    };
                    $scope.saveChanges = function() {
                        if($scope.manufacturerToEdit != null){
                            if ($scope.manufacturerToEdit.id == null)
                                $scope.saveNewManufacturer();

                            else 
                                $scope.updateManufacturer();
                        }
                    };
                    
                    $scope.hideAll = function(){
                      $scope.showManufacturers = false;
                      $scope.showMainCanopies = false;
                      $scope.showReserveCanopies = false;
                      $scope.showHarnessContainers = false;
                      $scope.showAads = false;
                    };
                    
                    $scope.showManufacturersButton = function(){
                      $scope.hideAll();
                      $scope.showManufacturers = true;
                    };
                    $scope.showMainCanopiesButton = function(){
                      $scope.hideAll();
                      $scope.showMainCanopies = true;
                    };
                    $scope.showReserveCanopiesButton = function(){
                      $scope.hideAll();
                      $scope.showReserveCanopies = true;
                    };
                    $scope.showHarnessContainersButton = function(){
                      $scope.hideAll();
                      $scope.showHarnessContainers = true;
                    };
                    $scope.showAadsButton = function(){
                      $scope.hideAll();
                      $scope.showAads = true;
                    };
                    
                    function getMainCanopies() {
                        RestService.getMainCanopies()
                                .success(function(m) {
                                    $scope.mainCanopies = m;
                                })
                                .error(function(error) {
                                    $scope.status = 'Fikk ikke hentet hovedskjermer fra databasen: ' + error.message;
                                });
                    }
                    getMainCanopies();
                    
                    $scope.editMainCanopy = function(canopy){
                      $scope.mainCanopyToEdit = jQuery.extend(true, {}, canopy);
                    };
                    
                    $scope.$watch(function() {
                            return $scope.mainCanopyManufacturer.id;
                    }, function() {
                        for (var i = 0; i < $scope.manufacturers.length; i++) {
                            if ($scope.mainCanopyManufacturer.id == $scope.manufacturers[i].id) {
                                $scope.mainCanopyManufacturer = $scope.manufacturers[i];
                            }
                        };
                    }, true);
                });

})();