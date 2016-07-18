angular.module('reportingApp').directive('fullscreen', function ($location,$window,$timeout,$document) {
	var directive = {};

	directive.restrict = 'E';
	directive.transclude=true;
	directive.templateUrl = "observation/directives/fullscreen.html";

	directive.scope = {
		observation: '=',
		acl: '=',
		title: '@',
		fullscreen: '='
	};

	directive.link = function ($scope, element, attrs) {

		$scope.hideFullscreen = function(){
			$location.search('ui','');
		};

		$window.scrollTo(0, 0);

		$scope.$on("$destroy", function() {
			var fullscreen = $scope.fullscreen;
			$timeout(function(){
				var elem = $document[0].getElementById(fullscreen);
					if(elem){
						$window.scrollTo(0, elem.offsetTop-70);
					}else{
						console.log("Not scrolling to "+fullscreen);
					}


			},0);

		});

	};

	return directive;
});