/**
 * 
 * Workflow directive
 * 
 * Skal bruke workflow servicen for å hente og utføre operasjoner mot observasjonens workflow
 * 
 */


angular.module('reportingApp')
	   .directive('workflowtimeline', function (ObservationService,$rootScope, Definitions) {
  
	var directive = {};

	directive.restrict = 'E';

	directive.transclude=true;
	
	directive.scope = {
		observation: '=',
		audit: '='
	};
	
	directive.templateUrl = "observation/directives/workflowtimeline.html";
	
	
	directive.controller = function ($scope, $rootScope, $location) {

		$scope.workflowActions = {init: 'Opprettet', send_to_hi: 'Sendt til HI', approve_hi: 'Godkjent av HI', reject_hi: 'Avslått av HI', approve_fs: 'Godkjent av fagsjef',
				reject_fs: 'Avslått av Fagsjef', approve_su: 'Godkjent av SU', reject_su: 'Avslått av SU', withdraw: 'Trekt tilbake', reopen: 'Gjenåpnet', reopen_su: 'Gjenåpnet av SU'};
		
		$scope.workflowColors = {init: 'b-primary', send_to_hi: 'b-success', approve_hi: 'b-success', reject_hi: 'b-danger', approve_fs: 'b-success',
				reject_fs: 'b-danger', approve_su: 'b-success', reject_su: 'b-danger', withdraw: 'b-dark', reopen: 'b-warning', reopen_su: 'b-warning'};
		
	};

		
	directive.link = function($scope, element, attrs) {

		//$scope.observationTypes = Definitions.getObservationTypes();
	
		
	};
		
	
	return directive;
	
});



