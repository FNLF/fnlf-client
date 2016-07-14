(function () {





	var tagtypeahead = function (RestService,Functions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/shared/directives/tagtypeahead.html";

		directive.scope = {
			model:'=',
			group: '@',
			noun: '@',
			selectfn: '=',
			acl: '='
		};

		directive.link = function ($scope, element, attrs, ctrl) {

			if($scope.model instanceof Array){
				$scope.model = "";
			}

			$scope.capitalize = function(){
				$scope.model = Functions.capitalizeFirstLetter($scope.model);
			};

			$scope.onSelect = function(item, model,label){
				$scope.model = Functions.capitalizeFirstLetter(model);
				RestService.addTag($scope.model,$scope.group);

				if($scope.selectfn){
					$scope.selectfn();
				}
			};

			$scope.tags = [];

			$scope.refresh = function(){
				RestService.getTags($scope.group)
					.then(function(data){
						$scope.tags = Functions.prepareTags(data);
					});
			};

			$scope.refresh();

			$scope.tooManyWordsInTag = false;

			$scope.$watch('model',function(){
				$scope.tooManyWordsInTag = ($scope.model.split(' ').length >= 5);
			});

		};

		return directive;
	};

	angular.module('fnlf-directives').directive('tagtypeahead', tagtypeahead);


angular.module('fnlf-directives')
.directive('typeaheadFocus', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModel) {

      //trigger the popup on 'click' because 'focus'
      //is also triggered after the item selection
      element.bind('click', function () {

        var viewValue = ngModel.$viewValue;

        //restore to null value so that the typeahead can detect a change
        if (ngModel.$viewValue == ' ') {
          ngModel.$setViewValue(null);
        }

        //force trigger the popup
        ngModel.$setViewValue(' ');

        //set the actual value in case there was already a value in the input
        ngModel.$setViewValue(viewValue || ' ');
      });

      //compare function that treats the empty space as a match
      scope.emptyOrMatch = function (actual, expected) {
        if (expected == ' ') {
          return true;
        }
        return actual.indexOf(expected) > -1;
      };
    }
  };
});
})();