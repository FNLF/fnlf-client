

angular.module('reportingApp')
	   .directive('commentsButton', function ($rootScope) {

		var directive = {};
		directive.restrict = 'E';
       	directive.scope = {
       	};


       	directive.template = '<button class="btn btn-sm btn-success" ng-click="openCommentAside()"><i class="fa fa-comments fa-fw"></i> Kommentarer</button>';


	   	directive.link = function($scope, element, attrs) {
			$scope.openCommentAside = function(){
				console.log('click');
				$rootScope.setFullscreen('comments');
			};

	   	};

		return directive;
		});


angular.module('reportingApp')
	   .directive('comments', function (RestService, ObservationService, ResolveService, $rootScope) {
  
	var directive = {};

	directive.restrict = 'E';
	
	directive.scope = {
		observation: '=',
	};


	directive.templateUrl = '/app/obs/observation/directives/comments.html';

	
	directive.controller = function ($scope, $rootScope, $location, $aside, $http, $q, $window) {

		var urlBase = '/api/v1';

		$scope.comments = [];
		$scope.comment = '';

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
			return (response.data);
		};

		$scope.saveComment = function(comment) {

			if(comment.length < 2) {
				$scope.error = "Påkrevd med minimum 2 bokstaver for å poste kommentar";
				return;
			}

			$scope._saveComment(comment).then(function(r){
				$scope.comment='';
				$scope.error='';
				$scope.getComments();
			});
		};



		$scope.getComments = function() {
			console.log('getComments');
			$scope._getComments().then(function(r){
				$scope.comments = r._items;
				console.log('getComments then');
				console.log($scope.comments);
			});
		};

        $scope.getComments();
		
	};

		
	directive.link = function($scope, element, attrs) {
		
		



	};
		
	
	return directive;
	
});



