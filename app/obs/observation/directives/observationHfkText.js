angular.module('reportingApp').directive('observationHfkText', function (Definitions,Functions) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "components/observation/directives/observationHfkText.html";

	directive.scope = {
		askmodel: '=',
		acl:'=',
		state:'@',
		editmode: '@',
		acl: '='
	};

	directive.controller = function($scope){

		$scope.enabled = function(state){
				if(state==$scope.state){
					if($scope.acl) {
						if ($scope.acl.w || $scope.acl.x){
							return true;
						}
					}
				}
			return false;
		};


	};

	directive.link = function ($scope, element, attrs) {

		$scope.tabs = [
			{state:'draft',title:'Opprinnelig vurdering'},
			{state:'pending_review_hi',title:'HI sin vurdering'},
			{state:'pending_review_fs',title:'Fagsjef sin vurdering'},
			{state:'pending_review_su',title:'SU sin vurdering'},
		];

		Functions.waitForIt($scope,'askmodel')
			.then(function(askmodel){
				if(angular.isUndefined(askmodel.text)){
					askmodel.text={};
				}

			});

		Functions.waitForIt($scope,'state')
			.then(function(state){
				Object.keys($scope.tabs).forEach(function(k){
					if($scope.tabs[k].state==state) {
						$scope.tabs[k].active = true;
					}
				})
			});


	};

	return directive;
});