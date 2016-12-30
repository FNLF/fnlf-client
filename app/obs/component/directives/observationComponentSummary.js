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

			$scope.buttonLabel="Detaljer";

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


	angular.module('reportingApp').directive('observationComponentSummaryNewCause', function ($location,Definitions) {

    		var directive = {};

    		directive.restrict = 'E';
    		directive.templateUrl = "/app/obs/component/directives/observationComponentSummary.html";

    		directive.scope = {
    			components: '=',
    			acl: '='
    		};

    		directive.link = function ($scope, element, attrs) {
				$scope.buttonLabel="Legg til ny årsak";
    			$scope.component = {flags:{cause:true},order:-1};
    			$scope.component.what = '';

				$scope.editComponent = function(component){
					$scope.components.push($scope.component);
				};

    			$scope.incidentOrElse = function(flags){

    				return false;
    			};

    		};

    		return directive;
    	});

	angular.module('reportingApp').directive('observationComponentSummaryNewConsequence', function ($location,Definitions) {

    		var directive = {};

    		directive.restrict = 'E';
    		directive.templateUrl = "/app/obs/component/directives/observationComponentSummary.html";

    		directive.scope = {

    			components: '=',
    			acl: '='
    		};

    		directive.link = function ($scope, element, attrs) {
				$scope.buttonLabel="Legg til ny konsekvens";
    			$scope.component = {flags:{consequence:true}};
    			$scope.component.what = '';


    			$scope.incidentOrElse = function(flags){
    				return false;
    			};

    		};

    		return directive;
    	});

	angular.module('reportingApp').directive('observationComponentSummaryNewIncident', function ($location,Definitions) {

    		var directive = {};

    		directive.restrict = 'E';
    		directive.templateUrl = "/app/obs/component/directives/observationComponentSummary.html";

    		directive.scope = {

    			components: '=',
    			acl: '='
    		};

    		directive.link = function ($scope, element, attrs) {
				$scope.buttonLabel="Legg til ny hendelse";
    			$scope.component = {flags:{incident:true}};
    			$scope.component.what = '';


    			$scope.incidentOrElse = function(flags){

    				return true;
    			};

    		};

    		return directive;
    	});
