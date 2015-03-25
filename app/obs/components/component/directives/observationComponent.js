(function () {

	var observationComponent = function (RestService, Definitions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/components/component/directives/observationComponent.html";
/*
		directive.scope = {
			observation: '=',
			component: '='
		};
*/
		directive.link = function ($scope, element, attrs) {
			$scope.componentWhatSelected = function(){
				console.log($scope.component.what);
				$scope.component.editTitle=false;
				RestService.addTag($scope.component.what,"what");
				$scope.copyFromTemplate();
			};

			$scope.copyFromTemplate = function() {

				if ($scope.component.what) {
					console.log("Copying from template");
						$scope.templates.forEach(function (t) {
						if ($scope.component.what == t.what) {
							if (!$scope.component.tags && !$scope.component.how && !$scope.component.where) {
								$scope.component.tags=[];
								angular.copy(t.tags, $scope.component.tags);
								$scope.component.attributes={};
								angular.copy(t.attributes, $scope.component.attributes);
								$scope.component.where = {};
								angular.copy(t.where, $scope.component.where);
								$scope.component.how="";
								angular.copy(t.how, $scope.component.how);
								console.log(t);
								console.log($scope.component);
							}
						}
					});
				}
			};



			$scope.resolvePersonsFn();

			$scope.whatEdited = function(component){
				component.editTitle=false;

				RestService.addTag(component.what,"what");
				$scope.copyFromTemplate();
			};
		};
		return directive;
	};

	angular.module('reportingApp').directive('observationComponent', observationComponent);

})();