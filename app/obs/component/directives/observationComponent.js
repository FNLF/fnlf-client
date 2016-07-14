(function () {

	var observationComponent = function (RestService, Definitions,Functions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/component/directives/observationComponent.html";
/*
		directive.scope = {
			observation: '=',
			component: '='
		};
*/
		directive.link = function ($scope, element, attrs) {

			$scope.flags = ['incident','cause','consequence','barrier'];
			
			//Backwards compatibility
			if(!$scope.component.ask) $scope.component.ask = {attitude: 0, skills: 0, knowledge: 0};
			
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

			$scope.componentWhatSelected = function(){
				$scope.copyFromTemplate();
				$scope.whatEdited($scope.component);
			};

			$scope.copyFromTemplate = function() {

				if ($scope.component.what) {
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
								
								$scope.component.ask = {attitude: 0, skills: 0, knowledge: 0}; //@see: observationHfkSelector for backward compatibility
								angular.copy(t.ask, $scope.component.ask);

							}
						}
					});
				}
			};



			$scope.resolvePersonsFn();
			$scope.autoTags=[];
			$scope.autoTags=Functions.autoTag($scope.component.what);

			$scope.addAutoTag = function(autoTag){
				if(angular.isUndefined($scope.component.tags)){
					$scope.component.tags = [];
				}
				if($scope.component.tags.indexOf(autoTag)==-1){
					$scope.component.tags.push(autoTag);
					RestService.addTag(autoTag,"component");
				}
				var index = $scope.autoTags.indexOf(autoTag);
				$scope.autoTags.splice(index,1);

			};

			$scope.autoTag = function(tagSrc){
				$scope.autoTags=Functions.autoTag(tagSrc);

			};
			//Disable freetext autotagging for now
			//if($scope.acl.w){
			//	$scope.autoTag($scope.component.how);
			//}
			$scope.whatEdited = function(component){
				component.editTitle=false;
				$scope.copyFromTemplate();
				$scope.autoTag(component.what);
			};
		};
		return directive;
	};

	angular.module('reportingApp').directive('observationComponent', observationComponent);

})();