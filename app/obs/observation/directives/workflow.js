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


		directive.scope = {
			observation: '=',
			observationChanges: '=',
			acl: '=',
			isFinished: '='
		};

		directive.templateUrl = '/app/obs/observation/directives/workflow.html';


		directive.controller = function ($scope, $rootScope, $location, $timeout) {

			$scope.workflowActions = {
				init: 'Opprettet',
				set_ready: 'Satt klar',
				send_to_hi: 'Sendt til HI',
				approve_hi: 'Godkjent av HI',
				reject_hi: 'Avslått av HI',
				approve_fs: 'Godkjent av fagsjef',
				reject_fs: 'Avslått av Fagsjef',
				approve_su: 'Godkjent av SU',
				reject_su: 'Avslått av SU',
				withdraw: 'Trekt tilbake',
				reopen: 'Gjenåpnet',
				reopen_su: 'Gjenåpnet av SU'
			};


			$scope.workflowTransition = function (action, comment) {
				$scope.isFinished = true;
				$timeout(function () {
					if ($scope.isFinished) {
						if ($location.$$search.ui) {
							$location.search('ui','').replace();
						}
					}

				}, 0);
				//If unsaved changes- save those first!
				ObservationService.changeWorkflowState($scope.observation._id, action, comment, function (updated) {
					$scope.observation = updated;

				});

				//Re-render all directives
				$rootScope.loadObservation();
			};


		};


		directive.link = function ($scope, element, attrs) {

			$scope.isFinished = false;

			$scope.observationTypes = Definitions.getObservationTypes();

			$scope.$watch('observation', function (newValue, oldValue) {

				if (newValue && newValue._id) {

					ObservationService.getWorkflowState($scope.observation._id, $scope.observation.id)
						.then(function (workflowState) {
							$scope.workflowpermission = workflowState.workflowpermission;
							$scope.tt = workflowState.tt;
							$scope.tooltip = workflowState.tooltip;
							$scope.wf = workflowState.wf;
							$scope.btn_title = workflowState.btn_title;
							$scope.btn_descr = workflowState.btn_descr;
							$scope.btns = workflowState.btns;
							$scope.username = workflowState.username;
							$scope.title = workflowState.title;
						});

				}

			});

		};


		return directive;

	});



