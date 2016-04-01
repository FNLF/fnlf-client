(function () {
    angular.module('reportingApp').directive('flagseditor', function (Definitions,Functions) {
        var directive = {};

        directive.restrict = 'E';
        directive.templateUrl = "/app/obs/component/directives/flagseditor.html";

        directive.scope = {
            attributes: '=',
            acl: '='
        };

        directive.link = function ($scope, element, attrs) {
            $scope.allAttributes  = Definitions.getComponentAttributes();

            $scope.toggle = function(attribute){
                if($scope.attributes[attribute]){
                    delete $scope.attributes[attribute];
                }else{
                    $scope.attributes[attribute]=true;
                }
            };

        };

        return directive;
    });

})();
