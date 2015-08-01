angular.module('resolve')
	.directive('resolveuseravatar', function ($http, $q, ResolveService) {

		var directive = {};

		directive.restrict = 'E';
		directive.template = '<img class="img-responsive user-photo" ng-src="{{avatar.dataURL}}"></img>';

		directive.scope = {
			userid: '=',
			
		};

		directive.link = function ($scope, element, attrs) {
			if ($scope.userid > 0) {
				
				$scope.avatar = {dataURL: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='};
				
				ResolveService.getUserAvatar($scope.userid).then(function(data) {
					if(data.avatar) {
						$scope.avatar.dataURL = 'data:'+data.avatar.content_type+';base64,'+data.avatar.file;
					}
				});
			}

		};
		return directive;
	});

/*
 * heigth: '=',
 * width: '='
 * height="{{height}}" width="{{width}}" 
 */
