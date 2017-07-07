


	angular.module('reportingApp').directive('observationComponentSummary', function ($location,Definitions,ComponentService) {

		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/component/directives/observationComponentSummary.html";

		directive.scope = {
			component: '=',
			components: '=',
			acl: '='
		};

		directive.link = function ($scope, element, attrs) {

			$scope.templateMode="component";
			$scope.buttonLabel="Rediger";
			$scope.buttonIcon="edit";

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

			$scope.canUp = function(){

				if(!$scope.acl){
					return false;
				}

				if(!$scope.acl.w){
					return false;
				}

				var length = $scope.components.length;
				if(length <2){
					return false;
				}
				var index = $scope.components.indexOf($scope.component);

				if($scope.component.flags.incident){
					return false;
				}

				if($scope.component.flags.consequence){
					var incidentIndex = ComponentService.incidentIndex($scope.components,$scope.component);
					if(index-1==incidentIndex){
						return false;
					}
				}

				return index > 0;
			};

			$scope.moveUp = function(){
				ComponentService.decrementOrder($scope.components,$scope.component);
			};

			$scope.canDown = function(){
				if(!$scope.acl){
					return false;
				}

				if(!$scope.acl.w){
					return false;
				}

				var length = $scope.components.length;
				if(length <2){
					return false;
				}
				var index = $scope.components.indexOf($scope.component);

				if($scope.component.flags.incident){
					return false;
				}

				if($scope.component.flags.cause){
					var incidentIndex = ComponentService.incidentIndex($scope.components,$scope.component);

					if(index+1==incidentIndex){
						return false;
					}
				}
				return index < length-1;
			};

			$scope.moveDown = function(){
				ComponentService.incrementOrder($scope.components,$scope.component);
			};

			$scope.canTrash = function(){
				return $scope.acl && $scope.acl.w && $scope.component.flags['incident']!=true;
			};

			$scope.trash = function(){
				ComponentService.deleteComponent($scope.components,$scope.component);
			};

		};

		return directive;
	});


	angular.module('reportingApp').directive('observationComponentSummaryNewCause', function ($location,Definitions,Functions,ComponentService) {

    		var directive = {};

    		directive.restrict = 'E';
    		directive.templateUrl = "/app/obs/component/directives/observationComponentSummary.html";

    		directive.scope = {
    			involved: '=',
    			components: '=',
    			acl: '='
    		};

    		directive.link = function ($scope, element, attrs) {
				$scope.templateMode="new";
				$scope.buttonLabel="Legg til årsak";
				$scope.buttonIcon="plus";
    			$scope.component = ComponentService.newComponent('cause',-1,$scope.involved);



				$scope.editComponent = function(component){
					if($scope.component.what.trim().length > 0){
						$scope.components.push($scope.component);
						ComponentService.reorder($scope.components);
						$scope.component = ComponentService.newComponent('cause',-1,$scope.involved);
					}
				};

				$scope.componentWhatSelected = function(){
					$scope.component.what = Functions.capitalizeFirstLetter($scope.component.what);
					$scope.editComponent($scope.component);

				};


    			$scope.incidentOrElse = function(flags){

    				return false;
    			};

    		};

    		return directive;
    	});

	angular.module('reportingApp').directive('observationComponentSummaryNewConsequence', function ($location,Definitions,Functions,ComponentService) {

    		var directive = {};

    		directive.restrict = 'E';
    		directive.templateUrl = "/app/obs/component/directives/observationComponentSummary.html";

    		directive.scope = {
				involved: '=',
    			components: '=',
    			acl: '='
    		};

    		directive.link = function ($scope, element, attrs) {
				$scope.templateMode="new";
				$scope.buttonLabel="Legg til konsekvens";
				$scope.buttonIcon="plus";

    			$scope.component = ComponentService.newComponent('consequence',999,$scope.involved);



				$scope.editComponent = function(component){
					if($scope.component.what.trim().length > 0){
						$scope.components.push($scope.component);
						ComponentService.reorder($scope.components);
						$scope.component = ComponentService.newComponent('consequence',999,$scope.involved);
					}
				};

				$scope.componentWhatSelected = function(){
					$scope.component.what = Functions.capitalizeFirstLetter($scope.component.what);
					$scope.editComponent($scope.component);

				};

    			$scope.incidentOrElse = function(flags){
    				return false;
    			};

    		};

    		return directive;
    	});

	angular.module('reportingApp').directive('observationComponentSummaryNewIncident', function ($location,Definitions,Functions,ComponentService) {

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
				$scope.templateMode="new";
				$scope.buttonLabel="Legg til hendelse";
				$scope.buttonIcon="plus";

    			$scope.component = ComponentService.newComponent('incident',0,$scope.involved);


				var unbind = $scope.$watch('observationTitle',function(){
					if(!$scope.component.what && $scope.observationTitle){
						$scope.component.what = $scope.observationTitle;
					}
				});

				$scope.editComponent = function(component){
					$scope.components.push($scope.component);
					ComponentService.reorder($scope.components);
					$scope.component = ComponentService.newComponent('incident',0,$scope.involved);
				};

				$scope.componentWhatSelected = function(){

				};

    			$scope.incidentOrElse = function(flags){

    				return true;
    			};

    		};

    		return directive;
    	});
