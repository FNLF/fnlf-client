(function () {





	var singlepersonselector = function (RestService,Functions,ResolveService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/shared/directives/singlepersonselector.html";

		directive.scope = {
			personmodel:'=',
			noun: '@',
			acl: '=',
			selectfn: '='
		};

		directive.link = function ($scope, element, attrs, ctrl) {

			$scope.model=[];

			var unset = $scope.$watch('personmodel',function(){
				if($scope.personmodel){
					$scope.model.push($scope.personmodel);
				}

				unset();
            });


			$scope.onSelect = function (item, model) {

				$scope.personmodel=item;
			};

			$scope.onRemove = function(item,model){
				var index = $scope.model.indexOf(model);

				if (index > -1) {
					$scope.model.splice(index,1);
				}
				$scope.personmodel=null;
			};


			$scope.personsFromDb = [];

			$scope.getPersonsByName = function (name) {
				RestService.getUserByName(name)
					.then(function (response) {
						var persons = {};
						$scope.model.forEach(function(m){
							persons[m.id]=true;
						});

						$scope.personsFromDb = response._items.filter(function(p){return !persons[p.id]});
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