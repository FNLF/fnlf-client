angular.module('reportingApp').directive('searchfilters', function () {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "/app/obs/search/directives/searchfilters.html";

	directive.scope = {
		filter:'='
	};

	directive.controller = function($scope,RestService,Definitions){

		$scope.jumptypes = [];

		function getJumpTypes(){
			RestService.getJumpTypes()
				.then(function(data){
					$scope.jumptypes = data._items;
					$scope.jumptypes.unshift('');
				});
		}
		getJumpTypes();

		$scope.clubs = [];
		$scope.getClubs = function () {
			RestService.getClubs()
				.then(function (response) {
					$scope.clubs = response._items;
					$scope.clubs.unshift('');
				});
		};
		$scope.getClubs();

		$scope.observationTypes = Definitions.getObservationTypes();
		$scope.observationTypes.unshift('');

	};

	directive.link = function ($scope, element, attrs) {
		$scope.allacl={w:true};
	};

	return directive;
});
