
(function () {
	angular.module('reportingApp').directive('flags', function (Definitions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/components/component/directives/flags.html";

		directive.scope = {
			attributes: '=',
			acl: '='
		};

		directive.link = function ($scope, element, attrs) {
            $scope.allAttributes  = Definitions.getComponentAttributes();

		};

		return directive;
	});

})();


(function () {
	angular.module('reportingApp').directive('flagseditor', function (Definitions,Functions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/components/component/directives/flagseditor.html";

		directive.scope = {
			attributes: '=',
			acl: '='
		};

		directive.link = function ($scope, element, attrs) {
            $scope.allAttributes  = Definitions.getComponentAttributes();

			$scope.toggle = function(attribute){
				if($scope.attributes[attribute]){
					delete $scope.attributes[attribute];
				}else{
					$scope.attributes[attribute]=true;
				}
			};

		};

		return directive;
	});

})();



(function () {
	angular.module('reportingApp').directive('flag', function () {
		var directive = {};

		directive.restrict = 'E';
		directive.template = '<span><a href="/app/obs/#!/search/flag/{{attribute}}"><span ng-transclude></span></a></span>';
		directive.transclude=true;
		directive.scope = {
			attribute: '@'
		};

		directive.link = function ($scope, element, attrs) {

		};

		return directive;
	});

})();