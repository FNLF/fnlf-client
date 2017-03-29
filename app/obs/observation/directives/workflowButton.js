/**
 *
 * Workflow directive
 *
 * Skal bruke workflow servicen for å hente og utføre operasjoner mot observasjonens workflow
 *
 */


angular.module('reportingApp')
	.directive('workflowButton', function (RestService, ObservationService, $rootScope, $window, Definitions) {

		var directive = {};

		directive.restrict = 'E';

		directive.transclude = true;

		directive.scope = {
			observation: '=',
			observationChanges: '=',
			acl: '='
		};

		directive.template = function (tElement, tAttrs) {

			return '<button ng-disabled="workflowDisabledFn()" \
				popover-trigger="mouseenter" type="button" \
				class="btn btn-{{tt}}" ng-click="openWorkflowAside()"> \
				<span ng-transclude></span> <i class="fa fa-random fa-fw"></i> {{btn_title}}</button>';
		};


		directive.controller = function ($scope, $rootScope) {

			$scope.workflowDisabledFn = function(){
				return $rootScope.observationIsChanged();
			};

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


			$scope.openWorkflowAside = function () {
				if (!$scope.workflowpermission) {
					return;
				}

				$rootScope.setFullscreen("workflow");

			};

		};


		directive.link = function ($scope, element, attrs) {

			$scope.observationTypes = Definitions.getObservationTypes();


			$scope.$watch('observation', function (newValue, oldValue) {

				if (newValue && newValue._id) {
					ObservationService.getWorkflowState($scope.observation._id, $scope.observation.id)
						.then(function (workflowState) {
							$scope.workflowpermission = workflowState.workflowpermission;
							$scope.tt = workflowState.tt;
							$scope.wf = workflowState.wf;
							$scope.btn_title = workflowState.btn_title;
							$scope.btn_descr = workflowState.btn_descr;
							$scope.btns = workflowState.btns;
							$scope.username = workflowState.username;
							$scope.title = workflowState.title;
							$rootScope.nav.toolbar[1] = workflowState.toolbarbutton;
							$rootScope.nav.toolbar[1].onclick = $scope.openWorkflowAside;
						});

				}

			});
		};

		return directive;

	});



