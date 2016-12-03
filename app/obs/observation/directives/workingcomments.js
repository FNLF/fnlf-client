/**
 * 
 * Workflow directive
 * 
 * Skal bruke workflow servicen for å hente og utføre operasjoner mot observasjonens workflow
 * 
 */


angular.module('reportingApp')
	   .directive('workingcomments', function (RestService, ObservationService, ResolveService, $rootScope) {
  
	var directive = {};

	directive.restrict = 'E';
	
	directive.scope = {
		observation: '=',
	};
	
	directive.transcluded = true;
	directive.templateUrl='/app/obs/observation/directives/comments.html';
	/*
	directive.template = function(tElement, tAttrs) { 
		
		return '<button class="btn btn-default" ng-click="openCommentAside()"><i class="fa fa-comments fa-fw"></i>Arbeidskommentarer</button>';
	};
	*/
	
	directive.controller = function ($scope, $rootScope, $location, $http, $q, $window) {

		var urlBase = '/api/v1';
		$scope.observationcomment = '';


		
		$scope.saveComment = function(c) {
			
			if($scope.observation.comments.length == 0) {
				$scope.observation.comments = [];
			};
			$scope.observation.comments.unshift({user: $rootScope.username, comment: c, date: new Date()});
			
			$rootScope.saveObservation();
			$scope.observationcomment = '';
			
		};
		
		
		function handleError(response) {
			if (!angular.isObject(response.data) || !response.data.message) {
				return ($q.reject("An unknown error occurred."));
			}
			return ($q.reject(response.data.message));
		}
		function handleSuccess(response) {
			return (response.data);
		};
		
	};

		
	directive.link = function($scope, element, attrs) {
		
		$scope.observationcomment='';

	};
		
	
	return directive;
	
});



