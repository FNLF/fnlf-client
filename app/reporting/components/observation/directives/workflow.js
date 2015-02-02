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
	   .directive('workflow', function (RestService, ObservationService, $modal, $sce, $compile) {
  
	var directive = {};

	directive.restrict = 'E';
	directive.transclude = true;
//	directive.replace = true;
	
//	directive.templateUrl = "/app/reporting/components/observation/directives/workflow.html";
	
	directive.scope = {
		observation: '=',
	};
	
	directive.template = function(tElement, tAttrs) { 
		
		return '<popover-button placement="bottom" button-classes="btn-primary" button-text="{{ observation.workflow.state }}" button-icon="fa fa-random fa-fw" on-close="onClose()" on-open="onOpen()"> \
							<title>{{title}}</title> \
							<content> \
							<div class="form-group"> \
							<label for="comment">Kommentarer:</label> \
							<textarea ng-model="workflow.comment" name="comment" class="form-control" rows="3" id="comment"></textarea> \
							</div><p> \
							<div ng-repeat="(key, value) in btns"> \
								<button class="pull-{{value.side}} btn btn-{{value.btn_class}}"  \
		 						ng-click="workflowTransition(\'{{value.resource}}\',\'{{workflow.comment}}\')">{{value.action}}</button> \
							</div> \
							</p> \
							<br /> \
 							</content> </popover-button>';
 							
	};
	
	
	directive.controller = function ($scope) {

		$scope.workflowTransition = function(action, comment) {
			ObservationService.changeWorkflowState($scope.observation._id, action, comment);
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
		
		RestService.getWorkflowState($scope.observation._id)
		.success(function (response) {
			
			var btns = [];
			var btn_class = 'default';
			console.log(response);
			for(k in response.actions) {
				var side = 'left';
				
				if(response.actions[k].resource == 'approve') btn_class = 'success';
				
				else if(response.actions[k].resource == 'withdraw') {
					btn_class = 'warning';
					side = 'right';
				}
				else if(response.actions[k].resource == 'reopen') {
					btn_class = 'primary';
					side = 'left';
				}
				else if(response.actions[k].resource == 'reject') {
					btn_class = 'danger';
					side = 'right';
				}
				else btn_class = 'default';
				
//				btns += '<button class="pull-'+side+' btn btn-'+bt_class+'" \
//						ng-click="changeWorkflowState("'+response.actions[k].resource+'","Kommentaren") \
//						">'+response.actions[k].action+'</button>';
				
				btns.push({action: response.actions[k].action, resource: response.actions[k].resource, side: side, btn_class: btn_class });
				
//				btns += '<button class="pull-'+side+' btn btn-'+bt_class+'" \
//				ng-click="workflowTransition(\''+$scope.observation._id+'\',\''+response.actions[k].resource+'\',\'Kommentaren\');" \
//				>'+response.actions[k].action+'</button>';
				
			};
				
			console.log(btns);
			
			$scope.wf = {btns: '', title: '', comment: ''};
	

			$scope.btns = btns;
			
			$scope.title = 'Workflow for Obs #' + $scope.observation.id;
			
			
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
			
		};
		
	
	return directive;
	
});



