(function () {

	var observationComponent = function ($location,RestService, Definitions,Functions,ResolveService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/component/directives/observationComponent.html";

		directive.scope = {
			observation: '=',
			acl: '='
		};

		directive.link = function ($scope, element, attrs) {

			var index = $location.search().index;

			$scope.component = $scope.observation.components[index];

			$scope.flags = ['incident','cause','consequence','barrier'];

			$scope.resolvePersonsFn = function(){

				$scope.persons = $scope.observation.involved.map(function(p){
					return {id:p.id, fullname:p.fullname, tmpname:p.tmpname};
				});

				$scope.persons.forEach(function(p){
					if(p.fullname){

					}
					else if(p.tmpname){
						p.fullname=p.tmpname;
					}
					else{
						ResolveService.getUser(p.id).then(function(u){
							p.fullname=u.firstname+' '+u.lastname;
						});
					}
				});

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