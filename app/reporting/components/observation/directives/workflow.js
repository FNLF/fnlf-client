/**
 * 
 * Workflow directive
 * 
 * Skal bruke workflow servicen for å hente og utføre operasjoner mot observasjonens workflow
 * 
 * Problemet er å bruke popovers, hvor man har en template til directivet
 * men også en template til content i popoveren - dvs en template for hver av de mulige actions i denne state
 * 
 * Burde kunne ta tak i fra workflowen og rendre ut fra det!
 * 
 * Ex:
 * {
    "state": "draft",
    "description": "Draft",
    "actions": [
        {
            "action": "Set Ready",
            "comment": false,
            "permission": [
                5766
            ],
            "resource": "approve",
            "title": "Set Ready"
        },
        {
            "action": "Withdraw",
            "comment": true,
            "permission": [
                5766
            ],
            "resource": "withdraw",
            "title": "Withdraw Observation"
        }
    ],
    "title": "Draft"
}
 * 
 */

//angular.module('reportingApp').controller('wfController', function ($scope, ObservationService) {
//
//			$scope.workflowTransition = function(action, comment) {
//				ObservationService.changeWorkflowState($scope.observation._id, action, comment);
//			};
//			
//			});

angular.module('reportingApp')
	   .directive('workflow', function (RestService, ObservationService, $modal, $sce, $compile, $rootScope, $route, $aside) {
  
	var directive = {};

	directive.restrict = 'E';
//	directive.transclude = true;
//	directive.replace = true;
	
//	directive.templateUrl = "/app/reporting/components/observation/directives/workflow.html";
	
	directive.scope = {
		observation: '=',
	};
	
	directive.transcluded = true;
	
	directive.template = function(tElement, tAttrs) { 
		
//		return '<popover-button placement="bottom" button-classes="btn-{{tt}}" button-text="{{ btn_title }}" button-icon="fa fa-random fa-fw" on-close="onClose()" on-open="onOpen()"> \
//							<title>{{title}}</title> \
//							<content> \
//							<div class="alert alert-info" role="alert" ng-show="error">{{workflow_error}}</div> \
//							{{btn_descr}} \
//							<div class="form-group"> \
//							<label for="comment">Kommentarer:</label> \
//							<textarea ng-model="workflow.comment" name="comment" class="form-control" rows="3" id="comment"></textarea> \
//							</div><p>\
//							<div ng-repeat="(key, value) in btns"> \
//							<div ng-if="value.permission.indexOf(username) > -1"> \
//							<button class="pull-{{value.side}} btn btn-{{value.btn_class}}"  \
//		 					ng-click="workflowTransition(value.resource,workflow.comment)"><i class="fa fa-{{value.icon}} fa-fw"></i>{{value.action}}</button> \
//							</div> \
//							</div> \
//							</p> \
//							<br /> \
// 							</content> </popover-button>';
		
//		data-placement="bottom" data-content="Apekatten satt i et tre" data-template="/app/reporting/components/observation/directives/workflow.html" \
//		data-auto-close="1"
		
		//return '<button type="button" class="btn btn-{{tt}}"><i class="fa fa-random fa-fw"></i>{{ btn_title }}</button>';
		
		return '<button tooltip-placement="top" tooltip="{{btn_descr}}" type="button" class="btn btn-{{tt}}" ng-click="openWorkflowAside()"><i class="fa fa-random fa-fw"></i>{{btn_title}}</button>';
	};
	
	
	directive.controller = function ($scope, $route) {

		$scope.workflowTransition = function(action, comment) {
			
			//If unsaved changesz- save those first!
			ObservationService.changeWorkflowState($scope.observation._id, action, comment);
			
			//Rerender all directives
			$scope.workflowAside.hide();
			$route.reload();
			};
		
		};
	// 
	
//	directive.controller = function($scope, $element){
//		
//		$scope.transition = function(resource, comment) {
//			
//			RestService.changeWorkflowState($scope.observation.id, resource, comment)
//			.succcess(function(response) {
//				console.log("Well done");
//				//Update the popover?
//			});
//		
//		};
//	};
//	
	directive.link = function($scope, element, attrs) {
		
		$scope.$watch('observation',function(newValue,oldValue) {
			
		
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
				
//				btns += '<button class="pull-'+side+' btn btn-'+bt_class+'" \
//				ng-click="workflowTransition(\''+$scope.observation._id+'\',\''+response.actions[k].resource+'\',\'Kommentaren\');" \
//				>'+response.actions[k].action+'</button>';
				
			};
			
			
			
			$scope.tt = 'default';
			if(['pending_review_hi','pending_review_fs','pending_review_su'].indexOf(response.state) > -1) $scope.tt = 'warning';
			else if(response.state == 'ready') $scope.tt = 'primary';
			else if(response.state == 'closed') $scope.tt = 'info';
			else if(response.state == 'withdrawn') $scope.tt = 'danger';
			else if(response.state == 'draft') $scope.tt = 'default';
            
			$scope.tooltip = response.description;
			
//			console.log($rootScope.username);
//			console.log([5766,45199].indexOf(+$rootScope.username));
			
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
		
			
//			var wfPopover = $popover(element, {
//				title: $scope.title, 
//				//content: '<button class="btn btn-primary">Test</button>',
//				placement: 'bottom',
//				html: false,
//				template: '/app/reporting/components/observation/directives/popover.html', 
//				contentTemplate:'/app/reporting/components/observation/directives/workflow.html', 
//				});
//			$scope.workflowPopover = $sce.trustAsHtml('<div class="form-group"> \
//					<label for="comment">Kommentarer:</label> \
//					<textarea ng-model="workflow.comment" name="comment" class="form-control" rows="3" id="comment"></textarea> \
//					</div> \
//					<p> '+btns+' </p> \
//					<br />');
			
//			var tmpl = '<popover-button class="btn btn-primary" placement="bottom" button-text="{{ observation.workflow.state }}" button-icon="fa fa-random fa-fw" on-close="onClose()" on-open="onOpen()"> \
//			  <title> {{workflowPopoverTitle}} </title> \
//			  <content> \
//			{{workflowPopover}} \
//			  </content> \
//			</popover-button>';
			
			
//			element.html(tmpl);
//
//		    var r = $compile(element.contents())($scope);
//		    
//		    element.append(r);
			
//			$scope.popoverTitle ="Title";
//			$scope.popoverContent = "Hello Popover<br />This is a multiline message!";
//			
			//var workflowPopover = angular.element(html);
//			$scope.workflowPopover = $compile(html);
			
			//element.append(workflowPopover);
			//compiled($scope);
			
			//$scope.workflowPopover = $compile();
			
//			var tmpl = '<div><p><i class="fa fa-cog fa-fw"></i><i>BADDA</i></p><button onclick="alert(\'WTF\')" class="btn btn-warning">ALERT</button></div>';
			
//			var myPopover = $popover(element, {
//				title: workflowPopoverTitle,
//				content: $sce.trustAsHtml(workflowPopover),
//				//contentTemplate: 'reportingApp/components/observation/directives/popover.tmpl.html',
//				placement: 'bottom',
//				html: true, //Uses sanitize and strips everything...
//				});
			
//			element.bind('click', function() {
//				  popover = $popover(element, {
//						title: workflowPopoverTitle,
//						content: $sce.trustAsHtml(workflowPopover),
//						//contentTemplate: 'reportingApp/components/observation/directives/popover.tmpl.html',
//						placement: 'bottom',
//						html: true, //Uses sanitize and strips everything...
//						});
//				  popover.$promise.then(popover.show);
//				});
			

		
			
		});
		
		});
			
		};
		
	
	return directive;
	
});



