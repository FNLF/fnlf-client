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
			query : '='
		};



		directive.link = function ($scope, element, attrs) {

			$scope.model = {};
			$scope.model.search = [];


			$scope.model.all = [];
			$scope.model.incident = [];
			$scope.model.situation = [];
			$scope.model.gear = [];

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


			$scope.incidentTags=[];
			getTags(ObservationService.getIncidentTagGroups())
				.then(function(data){
					$scope.incidentTags=data;
				});

			$scope.gearTags=[];
			getTags(ObservationService.getGearTagGroups())
				.then(function(data){
					$scope.gearTags=data;
				});


			$scope.situationTags=[];
			getTags(ObservationService.getSituationTagGroups())
				.then(function(data){
					$scope.situationTags=data;
				});


			$scope.refresh = function(search){

				$scope.model.text = Functions.capitalizeFirstLetter(search);




			};

			$scope.onSelect = function(tag){

			};

			$scope.go = function(){


				if($scope.model.text) {
					$scope.model.search.push($scope.model.text);
				}
				$scope.model.search = $scope.model.search.concat($scope.model.all,$scope.model.gear,$scope.model.incident,$scope.model.situation);

				var text = $scope.model.search.join(',');
				if(text) {
					var path = '/search/tag/' + encodeURIComponent(text);
					console.log(path);
					$location.path(path);
				}

			};

		};

		return directive;
	});


})();