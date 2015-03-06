(function () {



	var decrementOrderFunc = function(components,component){

		var objWithPrevIndex = null;
		components.forEach(function(c){
			if(c.order == (component.order-1)){
				objWithPrevIndex = c;
			}

		});

		if(objWithPrevIndex){
			var tmpOrder = component.order;
			component.order = objWithPrevIndex.order;
			objWithPrevIndex.order = tmpOrder
		}else{
         	if(component.order>1){
         		component.order--;
         	}
         }

	};

	var incrementOrderFunc = function(components,component){

		var objWithNextIndex = null;
		components.forEach(function(c){
			if(c.order == (component.order+1)){
				objWithNextIndex = c;
			}

		});

		if(objWithNextIndex){
			var tmpOrder = component.order;
			component.order = objWithNextIndex.order;
			objWithNextIndex.order = tmpOrder
		}else{
			if(component.order<components.length){
				component.order++;
			}
		}

	};


	angular.module('reportingApp').directive('observationComponentSummary', function (Definitions) {

		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "components/component/directives/observationComponentSummary.html";

		directive.scope = {
			component: '='
		};

		directive.link = function ($scope, element, attrs) {
			$scope.getAttributesAsTags = function(component){
				return Definitions.componentTagsFromAttributes(component.attributes);
			};

		};

		return directive;
	});

	angular.module('reportingApp').directive('observationComponentsSummary', function () {

		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "components/component/directives/observationComponentsSummary.html";
		
		directive.scope = {
			observation: '='
		};

		directive.link = function ($scope, element, attrs) {
			var i=0;
			$scope.observation.components.forEach(function(c){
				if(!c.order){
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


	var observationComponents = function (RestService,Functions, $aside, Definitions, $rootScope, $window) {
		var directive = {};

		directive.restrict = 'E';
//		directive.templateUrl = "components/observation/directives/observationComponents.html";
		
		directive.template = function(tElement, tAttrs) { 
			
			return '<button type="button" class="btn btn-default pull-right col-xs-12" ng-click="openIncidentAside()"><i class="fa fa-plus fa-fw"></i>Endre forløpet</button>';
		};

		directive.scope = {
			observation: '='
		};

		directive.controller = function ($scope, $rootScope, $location, $aside) {
			
			$scope.openIncidentAside = function() {
				$location.path('/observation/modal-route', false);
			    $scope.incidentAside = $aside({
			        scope: $scope,
			        title: 'Hendinger i forløpet',
			        show: true,
			        contentTemplate: '/app/reporting/components/component/directives/observationComponents.html',
			        template: '/shared/partials/aside.html',
			        placement: 'full-left',
			        container: 'body',
			        backdrop: 'static',
			        animation: 'am-slide-left'
			        });   
			};
			// Needs to manually close aside on back button
			$rootScope.$on('$routeChangeStart', function(event, next, current) {
				if($scope.incidentAside) {
				  if($scope.incidentAside.$scope.$isShown && $location.path().indexOf('/modal-route') == -1) {
					  $scope.incidentAside.hide(); 
				  }
				}
			});
			
			$scope.$on('aside.hide', function() {
			  if($location.path().indexOf('/modal-route') != -1) {
				  $window.history.back();
			  };
			});
			
		};
		directive.link = function ($scope, element, attr) {
			

			if(angular.isUndefined($scope.observation.components)){
				$scope.observation.components = [];
			}

			$scope.persons = $scope.observation.involved.map(function(p){
				return {id:p.id, fullname:p.fullname, tmpname:p.tmpname};
			});

			$scope.templates=[];
			RestService.getObservationComponentTemplates()
				.success(function(data){
					$scope.templates = data._items;
				});

			$scope.newComponent = function(selectedTemplate){
				console.log(selectedTemplate);
				$scope.selectedTemplate ={};
				Functions.copy(selectedTemplate,$scope.selectedTemplate);
				$scope.selectedTemplate.involved = [].concat($scope.persons);
				$scope.selectedTemplate.order = $scope.observation.components.length+1;

				$scope.observation.components.push($scope.selectedTemplate);

				$scope.closeOthers($scope.selectedTemplate);
				return false;
			};

			$scope.deleteComponent = function(component){
				var index = $scope.observation.components.indexOf(component);
				$scope.observation.components.splice(index,1);
			};



			$scope.getStaticTags = function(){
				return Definitions.getComponentTags();
			};

			$scope.staticTags = Definitions.getComponentTags();

			$scope.initComponent = function(component){
			//	component.attributes = Definitions.componentAttributesFromTags(component.tags);
			};

			$scope.closeOthers = function(component){

				$scope.observation.components.forEach(function(c){
					c.open=false;
				});
				component.open=true;
			};

			$scope.decrementOrder = function(component){
				decrementOrderFunc($scope.observation.components,component);
			};

			$scope.incrementOrder = function(component){
				incrementOrderFunc($scope.observation.components,component);
			};

		};

		return directive;
	};

	angular.module('reportingApp').directive('observationComponents', observationComponents);

})();