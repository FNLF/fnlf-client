(function () {





	var singlepersonselector = function (RestService,Functions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/shared/directives/singlepersonselector.html";

		directive.scope = {
			model:'=',
			noun: '@',
			selectfn: '=',
			acl: '='
		};

		directive.link = function ($scope, element, attrs, ctrl) {


			$scope.onSelect = function(item, model,label){

				console.log("onselect: ")
				console.log("item: "+item);
				console.log(model);
				console.log("label "+label);

				if($scope.selectfn){
					$scope.selectfn($scope.model);
				}
			};

			$scope.onBlur = function(item,model){

				$scope.onSelect(item,$scope.model);
			};


			$scope.formatLabel = function(model){
				return model.fullname;
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