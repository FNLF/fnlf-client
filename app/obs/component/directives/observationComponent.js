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
					ComponentService.fixInvolved($scope.component,$scope.persons);
					$scope.component.involved.forEach(function(person){
						$scope.involved[person.id]=true;
					});
				}


			};
			$scope.resolvePersonsFn();


			$scope.deleteComponent = function(component){
				ComponentService.deleteComponent($scope.observation.components,component);
				if ($location.$$search.ui) {
                	$location.search('ui','').replace();
				}
			};

			$scope.involvedChanged = function(person){

				var add = $scope.involved[person.id];

				if(add){
					console.log("adding "+person.id);
					console.log(person);
					$scope.component.involved.push(person);
				}else{
					$scope.component.involved = $scope.component.involved.filter(function(p){
						return p.id!=person.id;
					});
					console.log("removing "+person.id);
					console.log($scope.component.involved);
					$scope.involved[person.id]=add;
				}

			};
		};
		return directive;
	};

	angular.module('reportingApp').directive('observationComponent', observationComponent);

})();
