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


	angular.module('reportingApp').directive('observationComponentSummary', function ($location,Definitions) {

		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/component/directives/observationComponentSummary.html";

		directive.scope = {
			component: '=',
			components: '=',
			acl: '='
		};

		directive.link = function ($scope, element, attrs) {

			$scope.editComponent = function(component){

				var index = $scope.components.indexOf(component);
						if(index >-1){
							$location.search('ui','component');
            				$location.search('index',index);
						}


			};

			$scope.incidentOrElse = function(flags){
				var isIncident = true;
				Object.keys(flags).forEach(function(k){
					var v = flags[k];
					if(v){
						if(k=='incident'){
							isIncident = true;
						}
						else{
							isIncident = false;
						}
					}
				});
				return isIncident;
			};

		};

		return directive;
	});