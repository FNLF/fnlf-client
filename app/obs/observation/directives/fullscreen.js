angular.module('reportingApp').directive('fullscreen', function ($location,$window,$timeout,$document,$rootScope) {
	var directive = {};

	directive.restrict = 'E';
	directive.transclude=true;
	directive.templateUrl = "observation/directives/fullscreen.html";

	directive.scope = {
		observation: '=',
		acl: '=',
		fullscreen: '=',
		title: '@',
		observationChanges:'='
	};

	directive.link = function ($scope, element, attrs) {

		$scope.isFinished=false;

		$scope.hideFullscreen = function(){
			$scope.isFinished=true;
			$timeout(function(){
				if($scope.isFinished){
					if ($location.$$search.ui) {
						$location.search('ui','').replace();
					}
				}
			},0);
		};





		$window.scrollTo(0, 0);
		var fullscreen = $scope.fullscreen;
		$scope.$on("$destroy", function() {
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