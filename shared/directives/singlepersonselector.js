(function () {





	var singlepersonselector = function (RestService,Functions,ResolveService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/shared/directives/singlepersonselector.html";

		directive.scope = {
			personmodel:'=',
			noun: '@',
			selectfn: '=',
			acl: '='
		};

		directive.link = function ($scope, element, attrs, ctrl) {

			$scope.selectedName = 'X';

			if($scope.personmodel){
					ResolveService.getUserName($scope.personmodel.id)
						.then(function(username){
							console.log('watch:  name '+username);
							$scope.personmodel.fullname = username;
							//$scope.selectedName=username;
						});
           		}

			$scope.$watch('personmodel',function(){
           		if($scope.personmodel){
					ResolveService.getUserName($scope.personmodel.id)
						.then(function(username){
							console.log('watch:  name '+username);
							$scope.personmodel.fullname = username;
							$scope.selectedName=username;
						});
           		}
            });

			$scope.onSelect = function(item, model,label){

				console.log("onselect: "+item+" "+label);

				console.log(model);
				//console.log($scope.selectedName);
				$scope.personmodel=model;

				if($scope.selectfn){
					$scope.selectfn($scope.personmodel);
				}
			};

			$scope.onBlur = function(item,model){

				//$scope.onSelect(item,$scope.model);
			};


			$scope.formatLabel = function(model){
				console.log('format ');
				console.log(model);
				return model.fullname;
				//return $scope.selectedName
			};




			$scope.getPersonsByName = function (name) {
				return RestService.getUserByName(name)
					.then(function (response) {
						return response._items;
					});
			};

			var nonMemberId = function () {
				return Math.floor(Math.random() * 10000) * -1;
			};

			$scope.tagTransform = function (itemText) {
				return {fullname: itemText, tmpname: itemText, id: nonMemberId()}
			};


		};

		return directive;
	};

	angular.module('fnlf-directives').directive('singlepersonselector', singlepersonselector);

})();