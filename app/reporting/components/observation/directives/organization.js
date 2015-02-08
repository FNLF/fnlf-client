angular.module('reportingApp').directive('organizationSummary', function () {

	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "components/observation/directives/organizationSummary.html";

	directive.scope = {
		observation: '='
	};

	directive.link = function ($scope, element, attrs) {

	};

	return directive;
});


(function () {

	var organization = function (RestService, $aside) {
		var directive = {};

		directive.restrict = 'E';
		//directive.templateUrl = "components/observation/directives/organization.html";
		directive.template = function(tElement, tAttrs) { 
			
			return '<button type="button" class="btn btn-default pull-right" ng-click="openOrganizationAside()"><i class="fa fa-plus fa-fw"></i>Endre Organisasjon</button>';
		};

		directive.scope = {
			observation: '='
		};

		directive.link = function ($scope, element, attrs) {

			
			$scope.openOrganizationAside = function() {
			    $scope.myAside = $aside({
			        scope: $scope,
			        title: 'Hoppfeltorganiseringen',
			        //content: 'My Content', //Static custom content
			        show: true,
			        contentTemplate: '/app/reporting/components/observation/directives/organization.html',
			        template: '/shared/partials/aside.html',
			        placement: 'full-left',
			        container: 'body',
			        animation: 'am-slide-left',
			        });   
			};
			
			var removeDupesById = function(arr){
				var obj = {};

				angular.forEach(arr,function(v){
					obj[v.id]=v;
				});
				var result = [];

				angular.forEach(obj,function(v){
					result.push(v);
				});
				return result;
			};


			$scope.personSelected = function ($item, $model) {

			};

			$scope.personRemoved = function ($item, $model) {

			};
			$scope.personsFromDb=[];
			$scope.getPersonsByName = function (name) {

					$scope.existing = [].concat($scope.observation.organization.hl, $scope.observation.organization.hm, $scope.observation.organization.hfl);

					$scope.personsFromDb = removeDupesById([].concat($scope.existing));
					RestService.getUserByName(name)
						.success(function (response) {
							$scope.personsFromDb = removeDupesById($scope.existing.concat(response._items));
						});

			};

			$scope.tagTransform = function(itemText){

				return {fullname:itemText,id:0};
			}

		};

		return directive;
	};

	angular.module('reportingApp').directive('organization', organization);

})();