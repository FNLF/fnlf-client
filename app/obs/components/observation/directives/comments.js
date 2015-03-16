

angular.module('reportingApp')
	   .directive('comments', function (RestService, ObservationService, ResolveService, $rootScope) {
  
	var directive = {};

	directive.restrict = 'E';
	
	directive.scope = {
		observation: '=',
	};
	
	
	directive.template = function(tElement, tAttrs) { 
		
		return '<button class="btn btn-sm btn-success" ng-click="openCommentAside()"><i class="fa fa-comments fa-fw"></i> Kommentarer</button>';
	};
	
	
	directive.controller = function ($scope, $rootScope, $location, $aside, $http, $q, $window) {

		var urlBase = '/api/v1';
		
		$scope.openCommentAside = function() {
			
			$location.path('/observation/modal-route', false);
			
			  $scope.commentAside = $aside({
					scope: $scope,
					title: 'Kommenter #'+$scope.observation.id, 
					//content: 'My Content', 
					show: true,
					contentTemplate: '/app/obs/components/observation/directives/comments.html',
					template: '/shared/partials/aside.html',
					placement: 'full-left',
					container: 'body',
					backdrop: 'static',
					animation: 'am-slide-left',
					});

		};
			
		// Needs to manually close aside on back button
		$rootScope.$on('$routeChangeStart', function(event, next, current) {
		  if($scope.commentAside) {
			  if($scope.commentAside.$scope.$isShown && $location.path().indexOf('/modal-route') == -1) {
				  $scope.commentAside.hide();
			  }
		  }
		});
		
		$scope.$on('aside.hide', function() {
		  if($location.path().indexOf('/modal-route') != -1) {
			  $window.history.back();
		  };
		});
		
		$scope._saveComment = function(comment) {
			var request = $http({
				method : "post",
				data: {comment: comment, observation: $scope.observation._id, user: $rootScope.user_id},
				url : urlBase + '/observation/comments/'
			});
			return (request.then(handleSuccess, handleError));

		};
		$scope._getComments = function() {
			var request = $http({
				method : "get",
				url : urlBase + '/observation/comments/?where={"observation":"'+$scope.observation._id+'"}&sort=[("_created",-1)]'
			});
			return (request.then(handleSuccess, handleError));
			
		};
		
		
		function handleError(response) {
			if (!angular.isObject(response.data) || !response.data.message) {
				return ($q.reject("An unknown error occurred."));
			}
			return ($q.reject(response.data.message));
		}
		function handleSuccess(response) {
			console.log(response.data);
			return (response.data);
		};
		
		
	};

		
	directive.link = function($scope, element, attrs) {
		
		
		$scope.comments=[];
		$scope.comment='';
		
		$scope.saveComment = function() {
			
			if($scope.comment.length < 2) {
				$scope.error = "Påkrevd med minimum 2 bokstaver for å poste kommentar";
				return;
			}
			
			$scope._saveComment($scope.comment).then(function(r){
				$scope.comment='';
				$scope.error='';
				$scope.getComments();
			});
		};
		

		
		$scope.getComments = function() {
			
			$scope._getComments().then(function(r){
				$scope.comments = r._items;
			});
		};
		


	};
		
	
	return directive;
	
});



