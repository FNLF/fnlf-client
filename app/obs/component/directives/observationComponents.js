(function () {

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


	var observationComponents = function (RestService,Functions,ResolveService, Definitions, $rootScope, $window) {
		var directive = {};

		directive.restrict = 'E';

		
		directive.templateUrl = '/app/obs/component/directives/observationComponents.html';

			//return '<button type="button" class="btn btn-default pull-right col-xs-12" ng-click="openIncidentAside()"><i class="fa fa-plus fa-fw"></i>Endre forløpet</button>';


		directive.scope = {
			observation: '=',
			acl: '='
		};

		directive.controller = function ($scope, $rootScope, $location) {
			
		};
		directive.link = function ($scope, element, attr) {
			

			if(angular.isUndefined($scope.observation.components)){
				$scope.observation.components = [];
			}



			$scope.resolvePersonsFn = function(){

				$scope.persons = $scope.observation.involved.map(function(p){
					return {id:p.id, fullname:p.fullname, tmpname:p.tmpname};
				});

				$scope.persons.forEach(function(p){
					if(p.fullname){

					}
					else if(p.tmpname){
						p.fullname=p.tmpname;
					}
					else{
						ResolveService.getUser(p.id).then(function(u){
							p.fullname=u.firstname+' '+u.lastname;
						});
					}
				});

			};
			$scope.resolvePersonsFn();

			$scope.templates=[];
			RestService.getObservationComponentTemplates()
				.then(function(data){
					$scope.templates = data._items.filter(function(t){return t.active}).sort(function(a,b){return a.sort-b.sort});
				});

			$scope.newComponent = function(selectedTemplate){
				$scope.selectedTemplate ={};
				angular.copy(selectedTemplate,$scope.selectedTemplate);
				$scope.resolvePersonsFn();
				$scope.selectedTemplate.involved = [].concat($scope.persons);
				if($scope.selectedTemplate.flags.cause){
					if(!$scope.selectedTemplate.order) {
						$scope.selectedTemplate.order = -1;
					}
				}else{
					$scope.selectedTemplate.order = $scope.observation.components.length+1;
				}

				$scope.observation.components.push($scope.selectedTemplate);

				reorderFunc($scope.observation.components);

				$scope.closeOthers($scope.selectedTemplate);


				$scope.selectedTemplate.editTitle=true;
				$scope.selectedTemplate.what='';

				$scope.template = '';
				return false;
			};

			$scope.newConsequence = function(){
				var template = {};
				template.flags={consequence:true};
				template.attributes={};
				template.ask = {attitude: 0, skills: 0, knowledge: 0};
				$scope.newComponent(template);
			};

			$scope.newIncident = function(){
				var template = {};
				template.flags={incident:true};
				template.attributes={};
				template.ask = {attitude: 0, skills: 0, knowledge: 0};
				$scope.newComponent(template);
			};

			$scope.newCause = function(parentOrder){
				var template = {};
				template.flags={cause:true};
				template.attributes={};
				template.order = parentOrder - 0.5;
				template.ask = {attitude: 0, skills: 0, knowledge: 0};
				$scope.newComponent(template);
			};

			$scope.deleteComponent = function(component){
				var index = $scope.observation.components.indexOf(component);

				if($scope.observation.components.length == (index + 1)) {
					$scope.observation.components.splice(-1,1);
				}
				else {
					$scope.observation.components.splice(index,1);
				}
				
				reorderFunc($scope.observation.components);
			};


			$scope.closeOthers = function(component){

				$scope.observation.components.forEach(function(c){
					c.open=false;
				});
				component.open=true;
			};
			
			
			$scope.toggleComponent = function(component) {
				
				if(component.open == true) {
					component.open = false;
				}
				else {
					$scope.closeOthers(component);
				};
			};
			
			$scope.decrementOrder = function(component){
				decrementOrderFunc($scope.observation.components,component);
			};

			$scope.incrementOrder = function(component){
				incrementOrderFunc($scope.observation.components,component);
			};

			$scope.observationTypeName = 'Hendelse';
			$scope.componentWhatTag = 'near_miss';
			var getObservationTypeName = function(){
				$scope.observationTypeId=$scope.observation.type;
				var observationType = Definitions.resolveObservationTypes($scope.observation.type);
				if(observationType) {
					$scope.observationTypeName = observationType.toLowerCase();
				}
			};
			getObservationTypeName();

			$scope.addComponentIfEmpty = function() {
				if ($scope.observation.components.length == 0) {
					$scope.newIncident();
				}
			};



		};

		return directive;
	};

	angular.module('reportingApp').directive('observationComponents', observationComponents);

})();