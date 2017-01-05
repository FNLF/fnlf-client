(function () {

	var observationComponent = function ($location,RestService, Definitions,Functions,ResolveService,ComponentService) {
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

				$scope.involved = {};
				if(!angular.isUndefined($scope.component) && !angular.isUndefined($scope.component.involved)){
					$scope.component.involved.forEach(function(id){
						$scope.involved[id]=true;
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




			$scope.deleteComponent = function(component){
				ComponentService.deleteComponent($scope.observation.components,component);
				if ($location.$$search.ui) {
                	$location.search('ui','').replace();
				}
			};

			$scope.involvedChanged = function(personId){
				console.log(personId);
				var add = $scope.involved[personId];
				console.log(add);
				if(add){
					$scope.component.involved.push(personId);
				}else{
					var index = $scope.component.involved.indexOf(personId);
					if(index > -1){
						$scope.component.involved.splice(index,1);
					}
				}
				$scope.involved[personId]=add;
				console.log($scope.component.involved);
			};
		};
		return directive;
	};

	angular.module('reportingApp').directive('observationComponent', observationComponent);

})();