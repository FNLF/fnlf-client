
	angular.module('reportingApp').directive('observationComponentsSummary', function (ComponentService) {

		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/component/directives/observationComponentsSummary.html";

		directive.scope = {
			observation: '=',
			acl: '='
		};

		directive.link = function ($scope, element, attrs) {

			var i=0;
			$scope.observation.components.forEach(function(c){
				if(angular.isUndefined(c.order)){
					c.order = i;
				}
				i++;
			});

			$scope.decrementOrder = function(component){
				ComponentService.decrementOrder($scope.observation.components,component);
			};

			$scope.incrementOrder = function(component){
				ComponentService.incrementOrder($scope.observation.components,component);
			};

			$scope.hasNoIncident = function(){
				if($scope.observation){
					if($scope.observation.components){
						if($scope.observation.components.length == 0){
							return true;
						}else{
							for(var i = 0; i < $scope.observation.components.length; i++){
								if($scope.observation.components[i].flags['incident']){
									return false;
								}							
							}
						}
					}
				}
				return true;
			};

		};

		return directive;
	});
