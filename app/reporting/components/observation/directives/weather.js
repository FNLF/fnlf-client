angular.module('reportingApp').directive('weatherSummary', function () {

	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "components/observation/directives/weatherSummary.html";

	directive.scope = {
		observation: '='
	};

	directive.link = function ($scope, element, attrs) {

	};

	return directive;
});


(function () {

	var weather = function (RestService, $aside, $rootScope, $window) {
		var directive = {};

		directive.restrict = 'E';
		//directive.templateUrl = "components/observation/directives/organization.html";
		directive.template = function(tElement, tAttrs) { 
			
			return '<button type="button" class="btn btn-default pull-right col-xs-12" ng-click="openWeatherAside()"><i class="fa fa-plus fa-fw"></i>Endre Været</button>';
		};

		directive.scope = {
			observation: '='
		};

		directive.controller = function ($scope, $rootScope, $location, $aside) {
			
			$scope.openWeatherAside = function() {
				$location.path('/observation/modal-route', false);
			    $scope.organizationAside = $aside({
			        scope: $scope,
			        title: 'Værforholdene',
			        //content: 'My Content', //Static custom content
			        show: true,
			        contentTemplate: '/app/reporting/components/observation/directives/weather.html',
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

		};

		return directive;
	};

	angular.module('reportingApp').directive('weather', weather);

})();