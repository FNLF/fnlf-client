

	var newComponentFunc = function(flag,order,involved){

		var component = {flags:{},order:order,what:'',attributes:{},involved:[]};
		component.flags[flag]=true;
		if(involved){
			involved.forEach(function(p){
				component.involved.push(p.id);
			});
		}
		return component;

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


	angular.module('reportingApp').directive('observationComponentSummaryNewCause', function ($location,Definitions,ComponentService) {

    		var directive = {};

    		directive.restrict = 'E';
    		directive.templateUrl = "/app/obs/component/directives/observationComponentSummary.html";

    		directive.scope = {
    			involved: '=',
    			components: '=',
    			acl: '='
    		};

    		directive.link = function ($scope, element, attrs) {
				$scope.buttonLabel="Legg til ny årsak";
    			$scope.component = newComponentFunc('cause',-1,$scope.involved);



				$scope.editComponent = function(component){
					$scope.components.push($scope.component);
					ComponentService.reorder($scope.components);
					$scope.component = newComponentFunc('cause',-1);
				};

    			$scope.incidentOrElse = function(flags){

    				return false;
    			};

    		};

    		return directive;
    	});

	angular.module('reportingApp').directive('observationComponentSummaryNewConsequence', function ($location,Definitions,ComponentService) {

    		var directive = {};

    		directive.restrict = 'E';
    		directive.templateUrl = "/app/obs/component/directives/observationComponentSummary.html";

    		directive.scope = {
				involved: '=',
    			components: '=',
    			acl: '='
    		};

    		directive.link = function ($scope, element, attrs) {
				$scope.buttonLabel="Legg til ny konsekvens";
    			$scope.component = newComponentFunc('consequence',999,$scope.involved);



				$scope.editComponent = function(component){
					$scope.components.push($scope.component);
					ComponentService.reorder($scope.components);
					$scope.component = newComponentFunc('consequence',999);
				};

    			$scope.incidentOrElse = function(flags){
    				return false;
    			};

    		};

    		return directive;
    	});

	angular.module('reportingApp').directive('observationComponentSummaryNewIncident', function ($location,Definitions,ComponentService) {

    		var directive = {};

    		directive.restrict = 'E';
    		directive.templateUrl = "/app/obs/component/directives/observationComponentSummary.html";

    		directive.scope = {
				observationTitle: '=',
				involved: '=',
    			components: '=',
    			acl: '='
    		};

    		directive.link = function ($scope, element, attrs) {
				$scope.buttonLabel="Legg til ny hendelse";
    			$scope.component = newComponentFunc('incident',0,$scope.involved);


				var unbind = $scope.$watch('observationTitle',function(){
					if(!$scope.component.what){
						$scope.component.what = $scope.observationTitle;
						unbind();
					}
				});

				$scope.editComponent = function(component){
					$scope.components.push($scope.component);
					ComponentService.reorder($scope.components);
					$scope.component = newComponentFunc('incident',0);
				};

    			$scope.incidentOrElse = function(flags){

    				return true;
    			};

    		};

    		return directive;
    	});
