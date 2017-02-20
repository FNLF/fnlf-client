/**
 *
 *
 */
(function () {

	var reportingApp = angular.module('reportingApp', 
			['ngRoute', 'ngSanitize', 'ngCookies',
			 'ui.bootstrap', 'ui.select',
			 'angular-loading-bar',
			 'fnlf-login',
			 'resolve',
			 'inlinehelp',
			 'fnlf-services',
			 'fnlf-directives',
			 'ngFileUpload',
			 'ui.bootstrap.datetimepicker',
			 'ngMap',
			 'angular-confirm',
			 'ngTable',
			 'truncate','nl2br',
			 'angularMoment',
			 'angled-navbar.directives',
			 'config',
			 'ngIdle'

			 ]);

	reportingApp.config(['cfpLoadingBarProvider', 'KeepaliveProvider', 'IdleProvider', function (cfpLoadingBarProvider, KeepaliveProvider, IdleProvider) {

		cfpLoadingBarProvider.includeBar = true;
		cfpLoadingBarProvider.includeSpinner = true;

		var idleinterval = 15; //seconds
		IdleProvider.idle(idleinterval);
  		IdleProvider.timeout(5);
  		KeepaliveProvider.interval(idleinterval*4);
	}]);
	

	
	reportingApp.run(['$route', '$rootScope', '$location','$cookieStore','$window', 'amMoment','ENV', function ($route, $rootScope, $location,$cookieStore,$window, amMoment,ENV) {


			$window.ga('create', ENV.googleAnalyticsId, 'auto');

			$rootScope.$on('$locationChangeSuccess', function (event) {
				var page = $location.path();
				page = page.replace(/\d+/g, "000");
				if($location.search().ui){
					page = page + '?ui='+$location.search().ui;
				}

				$window.ga('send', 'pageview', '/app/obs/#!'+page);
			});

      		$rootScope.ENVname = ENV.name;
      		amMoment.changeLocale('nb');

      		$rootScope.$on('$viewContentLoaded', function () {
      			delete $rootScope.error;
      		});

      		$rootScope.initialized = true;

			var original = $location.path;
			$location.path = function (path, reload) {
				if (reload === false) {
					var lastRoute = $route.current;
					var un = $rootScope.$on('$locationChangeSuccess', function () {
						$route.current = lastRoute;
						un();
					});
				}

            return original.apply($location, [path]);
        };
    }]);
	
	reportingApp.factory('DoNotReloadCurrentTemplate', ['$route', function($route) {
		  return function(scope) {
		    var lastRoute = $route.current;
		    scope.$on('$locationChangeSuccess', function() {
		      if (lastRoute.$$route.templateUrl === $route.current.$$route.templateUrl) {
		        $route.current = lastRoute;
		      }
		    });
		  };
		}]);
	/** End aside/modal hack **/
	
})();