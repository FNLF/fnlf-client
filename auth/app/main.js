(function() {
  'use strict';
  angular.module('fnlf-auth', [
    'http-auth-interceptor',
    //'content-mocks',
    'login',
    'content',
    'ngRoute', 
    'ngCookies',
	'angular-loading-bar', 
	'ui.bootstrap'
  ])
  /**
   * This directive will find itself inside HTML as a class,
   * and will remove that class, so CSS will remove loading image and show app content.
   * It is also responsible for showing/hiding login form.
   */
  .directive('authDemoApplication', function($rootScope) {
    return {
      restrict: 'C',
      link: function(scope, elem, attrs) {
        //once Angular is started, remove class:
        elem.removeClass('waiting-for-angular');
        
        scope.$on('event:auth-loginRequired', function() {
        	$rootScope.error = 'Login is required';
        	$rootScope.currentUserSignedIn = false;
        });
        scope.$on('event:auth-loginConfirmed', function() {
        	$rootScope.currentUserSignedIn = true;
        });
        
        
      }
    }
  })
  // Loading bar config
.config([ 'cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
	cfpLoadingBarProvider.includeBar = true;
	cfpLoadingBarProvider.includeSpinner = false;
}])
.controller('LoginModalController', function ($scope, $modal, $log) {

    $scope.open = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'views/login-help.tmpl.html',
        controller: 'LoginModalInstanceController',
        size: size,
      });

    
    };
  })
  .controller('LoginModalInstanceController', function ($scope, $modalInstance) {

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })
  .factory('GlobalsService',
	    ['$cookieStore', '$rootScope',
	    function ($cookieStore, $rootScope) {
	    	
	    	var configs = {baseUrl : '/api/v1/'};
	    	
	    	var service = {};

	        service.get = function (key) {
	        	
	        	return configs[key];
	        };

	        return service;
	    	
	    }])



;


})();