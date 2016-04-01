/**
 * 
 * Workflow directive
 * 
 * Skal bruke workflow servicen for å hente og utføre operasjoner mot observasjonens workflow
 * 
 */


angular.module('reportingApp')
	   .directive('workflow', function (RestService, ObservationService, $aside, $rootScope, $window, Definitions) {
  
	var directive = {};

	directive.restrict = 'E';

	directive.transclude=true;
	
	directive.scope = {
		observation: '=',
		observationChanges: '=',
		acl: '='
	};
	
	directive.template = function(tElement, tAttrs) { 
		
		return '<button ng-disabled="disabledFn()" \
				popover-trigger="mouseenter" tooltip="{{btn_descr}}" type="button" \
				class="btn btn-{{tt}}" ng-click="openWorkflowAside()"> \
				<span ng-transclude></span> <i class="fa fa-random fa-fw"></i> {{btn_title}}</button>';
	};
	
	
	directive.controller = function ($scope, $rootScope, $location, $aside) {

		$scope.workflowActions = {init: 'Opprettet', set_ready: 'Satt klar', send_to_hi: 'Sendt til HI', approve_hi: 'Godkjent av HI', reject_hi: 'Avslått av HI', approve_fs: 'Godkjent av fagsjef',
				reject_fs: 'Avslått av Fagsjef', approve_su: 'Godkjent av SU', reject_su: 'Avslått av SU', withdraw: 'Trekt tilbake', reopen: 'Gjenåpnet', reopen_su: 'Gjenåpnet av SU'};
		
		
		
		$scope.workflowTransition = function(action, comment) {
			
			//If unsaved changes- save those first!
			ObservationService.changeWorkflowState($scope.observation._id, action, comment,function(updated){
				$scope.observation=updated;
			});
			
			//Hide aside programatically
			$scope.workflowAside.hide();
			//Re-render all directives
			$rootScope.loadObservation();
		};
			
		$scope.openWorkflowAside = function() {
			
			if(!$scope.workflowpermission) return; 
			
			$location.path('/observation/modal-route', false);
			
			  $scope.workflowAside = $aside({
					scope: $scope,
					title: $scope.title, 
					show: true,
					contentTemplate: '/app/obs/observation/directives/workflow.html',
					template: '/shared/partials/aside.html',
					placement: 'full-left',
					container: 'body',
					backdrop: 'static',
					animation: 'am-slide-left',
					});

		};
			
		// Needs to manually close aside on back button
		$rootScope.$on('$routeChangeStart', function(event, next, current) {
		  if($scope.workflowAside) {
			  if($scope.workflowAside.$scope.$isShown && $location.path().indexOf('/modal-route') == -1) {
				  $scope.workflowAside.hide();
			  }
		  }
		});
		
		$scope.$on('aside.hide', function() {
		  if($location.path().indexOf('/modal-route') != -1) {
			  $window.history.back();
		  };
		});
		
	};

		
	directive.link = function($scope, element, attrs) {

		$scope.observationTypes = Definitions.getObservationTypes();
	
		$scope.$watch('observation',function(newValue,oldValue) {
		
	if(newValue && newValue._id) {

		
		RestService.getWorkflowState($scope.observation._id)
				   .then(function (response) {
			
			var icon = '';
			var btns = [];
			var btnss = '';
			var btn_class = 'default';

			for(var k in response.actions) {
				var side = 'left';
				
				if(response.actions[k].resource == 'approve') {
					btn_class = 'success';
					icon = 'check';
				}
				
				else if(response.actions[k].resource == 'withdraw') {
					btn_class = 'warning';
					side = 'right';
					icon = 'ban';
				}
				else if(response.actions[k].resource == 'reopen') {
					btn_class = 'primary';
					side = 'left';
					icon = 'reply';
				}
				else if(response.actions[k].resource == 'reject') {
					btn_class = 'danger';
					side = 'right';
					icon = 'close';
				}
				else btn_class = 'default';
				
				btnss += '<button class="pull-'+side+' btn btn-'+btn_class+'" \
						ng-click="changeWorkflowState("'+response.actions[k].resource+'","Kommentaren") \
						">'+response.actions[k].action+'</button>';
				
				btns.push({permission: response.actions[k].permission, 
					action: response.actions[k].action,
					title: response.actions[k].title, 
					resource: response.actions[k].resource, 
					side: side, 
					btn_class: btn_class, 
					icon: icon });
				
				$scope.workflowpermission = response.actions[k].permission;
			};
			
			
			
			$scope.tt = 'default';
			if(['pending_review_hi','pending_review_fs','pending_review_su'].indexOf(response.state) > -1) $scope.tt = 'warning';
			else if(response.state == 'ready') $scope.tt = 'primary';
			else if(response.state == 'closed') $scope.tt = 'success';
			else if(response.state == 'withdrawn') $scope.tt = 'danger';
			else if(response.state == 'draft') $scope.tt = 'info';
	        
			$scope.tooltip = response.description;
			
			$scope.wf = {btns: '', title: '', comment: ''};
	
			$scope.btn_title = response.title;
			
			if(!$scope.workflowpermission) $scope.btn_descr = 'Du har ikke tilgang til arbeidsflyten';
			else $scope.btn_descr = response.description;
			
			$scope.btns = btns;
			$scope.username = +$rootScope.username;
			$scope.title = 'Arbeidsflyt for #' + $scope.observation.id;
			
			var disabledFn = function(){
				if(!$scope.workflowpermission || $scope.observationChanges) return true;
				
				return false;
			 };
			var toolbarbutton = {disabled:disabledFn, tooltip:response.description, text:response.title,btn_class:$scope.tt,icon:'random', onclick:$scope.openWorkflowAside};
			
			$rootScope.nav.toolbar[1] = toolbarbutton;
		});
	};
	});
		
	};
		
	
	return directive;
	
});



