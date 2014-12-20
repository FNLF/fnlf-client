(function(){

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
        .controller('PersonsController', 
            function($scope, RestService, DataService) {
                $scope.service = DataService;
                $scope.choosePersons = "Henter fra databasen...";
                $scope.anomaly = DataService.readAnomaly();
                getInvolved();
                
                function getInvolved(){
                    $scope.personsInvolved = [];
                    angular.forEach($scope.anomaly.involvedPersons, function(involved){
                       $scope.personsInvolved.push(involved.id); 
                    });
                };

                $scope.$watch(function() {
                    return $scope.personsInvolved;
                }, function() {  
                   var involved = [];
                    angular.forEach($scope.personsInvolved, function(selected) {
                        involved.push(getPersonById(selected));
                    });
                    $scope.anomaly.involvedPersons = involved;
                }, true);
                
                getPersons();

                $scope.$watch('service.readAnomaly()', function(newValue) {
                    $scope.anomaly = newValue;                    
                });

                function getPersons() {
                    $scope.personsFromDb = [];
                    $scope.personStatus = "Henter fra databasen";
                    $scope.showLoader = true;
                    RestService.getPersons()
                            .success(function(persons) {
                                $scope.personsFromDb= persons._items;
                                $scope.choosePersons = "Velg involvert(e) person(er)";
                                $scope.showLoader = false;
                            })
                            .error(function(error) {
                                $scope.personStatus = 'Fikk ikke hentet personer fra databasen: ' + error;
                            });
                };

                function getPersonById(id) {
                    for (var i = 0; i < $scope.personsFromDb.length; i++) {
                        if ($scope.personsFromDb[i].id == id) {
                            return $scope.personsFromDb[i];
                        }
                    }
                };

                $scope.saveNewPerson = function() {
                    RestService.savePerson($scope.newPerson);
                };

            });

})();