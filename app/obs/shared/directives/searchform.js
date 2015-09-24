(function () {



	angular.module('reportingApp').directive('searchform', function (RestService,Functions,$location,ObservationService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/shared/directives/searchform.html";

		directive.scope = {
			query : '='
		};

		directive.link = function ($scope, element, attrs) {



			$scope.model = {};
			$scope.model.search = '';

			var unbind = $scope.$watch('query',function(){
				if($scope.query){
					$scope.model.search = $scope.query;
					unbind();
				}
			});


			var groups = ObservationService.getObservationTagGroups();

			$scope.tags = [];



			RestService.getMostPopularTags(groups)
				.then(function(data){
					$scope.tags = Functions.deduplicate(data._items
						.map(function(t){
							return Functions.capitalizeFirstLetter(t.tag);
						}));
				});





			$scope.go = function(){
				var text = $scope.model.search;
				var path = '/search/tag/' + encodeURIComponent(Functions.capitalizeFirstLetter(text));
				$location.path(path);
			};

		};

		return directive;
	});


	angular.module('reportingApp').directive('flagsearch', function (RestService,Functions,$location,ObservationService,Definitions) {
		var directive = {};

		directive.restrict = 'E';
		directive.template = '<flags attributes = "all"></flags>';

		directive.scope = {

		};

		directive.link = function ($scope, element, attrs) {
            $scope.all = {};
            angular.forEach(Definitions.getComponentAttributes(),function(a){
                $scope.all[a.attribute]=true;
                });
		};

		return directive;
	});


	angular.module('reportingApp').directive('searchformadvanced', function (RestService,Functions,$location,ObservationService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/shared/directives/searchformadvanced.html";

		directive.scope = {
			model : '='

		};



		directive.link = function ($scope, element, attrs) {

			if(!$scope.model){
				$scope.model = {};
			}

			var unbind = $scope.$watch('query',function(){
				if($scope.query){
					$scope.model.search.push($scope.query);
					unbind();
				}
			});



			var getTags =  function(groups){
				return RestService.getMostPopularTags(groups)
					.then(function(data){
						return Functions.deduplicate(data._items
							.map(function(t){
								return Functions.capitalizeFirstLetter(t.tag);
							}));
					});
			};

			$scope.tags=[];
			getTags(ObservationService.getObservationTagGroups())
				.then(function(data){
					$scope.tags=data;
				});


			$scope.whatTags=[];
			getTags(ObservationService.getWhatTagGroups())
				.then(function(data){
					$scope.whatTags=data;
				});

			$scope.gearTags=[];
			getTags(ObservationService.getGearTagGroups())
				.then(function(data){
					$scope.gearTags=data;
				});


			$scope.atTags=[];
			getTags(ObservationService.getAtTagGroups())
				.then(function(data){
					$scope.atTags=data;
				});


			$scope.refresh = function(search){

				$scope.model.text = Functions.capitalizeFirstLetter(search);




			};

			$scope.onSelect = function(tag){

			};

			$scope.searchDisabled = function(){
				if(angular.isUndefined($scope.model)){
					return true;
				}

				if(angular.isUndefined($scope.model.what)){
					return true;
				}

				if(angular.isUndefined($scope.model.gear)){
					return true;
				}

				if(angular.isUndefined($scope.model.at)){
					return true;
				}

				return ($scope.model.what.length+$scope.model.gear.length+$scope.model.at)==0;
			};

			$scope.go = function(){
				var text = '';
				if($scope.model.what){
					text+='what='+$scope.model.what.join(',')+';';
				}
				if($scope.model.gear){
					text+='gear='+$scope.model.gear.join(',')+';';
				}
				if($scope.model.at){
					text+='at='+$scope.model.at.join(',')+';';
				}
				
				
				if(text) {
					var path = '/search/advanced/' + text;
					console.log(path);
					$location.path(path);
				}

			};

		};

		return directive;
	});


})();