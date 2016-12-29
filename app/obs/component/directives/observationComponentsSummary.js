	var reorderFunc = function(components){

		var orderedComponents = components.sort(function(a,b){return a.order-b.order});
		var i = 1;
		orderedComponents.forEach(function(c){
			c.order = i;
			i++;
		});

	};

	var decrementOrderFunc = function(components,component){
		component.order = component.order-1.1;
		reorderFunc(components);
	};

	var incrementOrderFunc = function(components,component){

		component.order = component.order+1.1;
		reorderFunc(components);
	};



	angular.module('reportingApp').directive('observationComponentsSummary', function () {

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
				decrementOrderFunc($scope.observation.components,component);
			};

			$scope.incrementOrder = function(component){
				incrementOrderFunc($scope.observation.components,component);
			};

		};

		return directive;
	});
