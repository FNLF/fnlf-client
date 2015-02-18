/**
 * 
 * Workflow directive
 * 
 * Skal bruke workflow servicen for å hente og utføre operasjoner mot observasjonens workflow
 * 
 */


angular.module('reportingApp')
	   .directive('workflow', function (RestService, ObservationService, $modal, $sce, $compile, $rootScope, $route, $aside) {
  
	var directive = {};

	directive.restrict = 'E';
	
	directive.scope = {
		observation: '=observation',
	};
	
	directive.transcluded = true;
	
	directive.template = function(tElement, tAttrs) { 
		
		
		return '<button tooltip-placement="top" tooltip="{{btn_descr}}" type="button" class="btn btn-{{tt}}" ng-click="openWorkflowAside()"><i class="fa fa-random fa-fw"></i>{{btn_title}}</button>';
	};
	
	
	directive.controller = function ($scope, $route) {

		$scope.workflowTransition = function(action, comment) {
			
			//If unsaved changes- save those first!
			ObservationService.changeWorkflowState($scope.observation._id, action, comment,function(updated){
				$scope.observation=updated;
			});
			
			//Hide aside programatically
			$scope.workflowAside.hide();
			//Re-render all directives
			$scope.loadObservation(); //$route.reload();
			};
		
	};

		
	directive.link = function($scope, element, attrs) {
	
	$scope.$watch('observation',function(newValue,oldValue) {
		
	if(newValue && newValue._id) {
		console.log(newValue);
		
		RestService.getWorkflowState($scope.observation._id)
				   .success(function (response) {
			
			var icon = '';
			var btns = [];
			var btnss = '';
			var btn_class = 'default';
			console.log(response);
			for(k in response.actions) {
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
				
			};
			
			
			
			$scope.tt = 'default';
			if(['pending_review_hi','pending_review_fs','pending_review_su'].indexOf(response.state) > -1) $scope.tt = 'warning';
			else if(response.state == 'ready') $scope.tt = 'primary';
			else if(response.state == 'closed') $scope.tt = 'info';
			else if(response.state == 'withdrawn') $scope.tt = 'danger';
			else if(response.state == 'draft') $scope.tt = 'default';
	        
			$scope.tooltip = response.description;
			
			$scope.wf = {btns: '', title: '', comment: ''};
	
			$scope.btn_title = response.title;
			$scope.btn_descr = response.description;
			$scope.btns = btns;
			$scope.username = +$rootScope.username;
			$scope.title = 'Workflow for Obs #' + $scope.observation.id;
			
	
			
			$scope.openWorkflowAside = function() {
				
				  $scope.workflowAside = $aside({
						scope: $scope,
						title: $scope.title, 
						//content: 'My Content', 
						show: true,
						contentTemplate: '/app/reporting/components/observation/directives/workflow.html',
						template: '/shared/partials/aside.html',
						placement: 'full-left',
						container: 'body',
						animation: 'am-slide-left',
						});
	
			};
			
	
		
			
		});
	};
	});
		
	};
		
	
	return directive;
	
});


