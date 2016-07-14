(function () {

	var organization = function (RestService, $aside, $rootScope, $window) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = '/app/obs/observation/directives/organization/organization.html';
		directive.scope = {
			observation: '=',
			acl: '='
		};

		directive.controller = function ($scope, $rootScope, $location, $aside) {
			
			$scope.openOrganizationAside = function() {
				$location.path('/observation/modal-route', false);
			    $scope.organizationAside = $aside({
			        scope: $scope,
			        title: 'Hoppfeltorganiseringen',
			        //content: 'My Content', //Static custom content
			        show: true,
			        contentTemplate: '/app/obs/observation/directives/organization/organization.html',
			        template: '/shared/partials/aside.html',
			        placement: 'full-left',
			        container: 'body',
			        backdrop: 'static',
			        animation: 'am-slide-left'
			        });   
			};
			// Needs to manually close aside on back button
			$rootScope.$on('$routeChangeStart', function(event, next, current) {
			  if($scope.organizationAside) {
				  if($scope.organizationAside.$scope.$isShown && $location.path().indexOf('/modal-route') == -1) {
					  $scope.organizationAside.hide(); 
				  }
			  }
			});
			
			$scope.$on('aside.hide', function() {
			  if($location.path().indexOf('/modal-route') != -1) {
				  $window.history.back();
			  };
			});
			
			
		};
		
		
		directive.link = function ($scope, element, attrs) {

			


			$scope.personSelected = function ($item, $model) {

			};

			$scope.personRemoved = function ($item, $model) {

			};
			$scope.personsFromDb=[];
			$scope.getPersonsByName = function (name) {
					RestService.getUserByName(name)
						.then(function (response) {
							$scope.personsFromDb = response._items;
						});
			};

			var nonMemberId = function(){
				return Math.floor(Math.random()*10000)*-1;
			};

			$scope.tagTransform = function(itemText){
				return {fullname:itemText,tmpname:itemText,id:nonMemberId()}
			};

		};

		return directive;
	};

	angular.module('reportingApp').directive('organization', organization);

})();