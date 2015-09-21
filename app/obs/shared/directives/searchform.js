(function () {



	angular.module('reportingApp').directive('searchform', function (RestService,Functions,$location,ObservationService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/shared/directives/searchform.html";

		directive.scope = {

		};

		directive.link = function ($scope, element, attrs) {



			$scope.model = {};
			$scope.model.search = '';



			var groups = ObservationService.getObservationTagGroups();

			$scope.tags = [];



			RestService.getMostPopularTags(groups)
				.then(function(data){
					$scope.tags = Functions.deduplicate(data._items
						.map(function(t){
							return Functions.capitalizeFirstLetter(t.tag);
						}));
				});

			$scope.refresh = function(search){

				//$scope.model.text = Functions.capitalizeFirstLetter(search);


			};

			$scope.onSelect = function(tag){
				console.log('onSelect '+tag);


				if($scope.model.search) {
					var path = '/search/tag/' + encodeURIComponent($scope.model.search);
					console.log(path);
					$location.path(path);
				}

			};

			$scope.go = function(){

				var text = $scope.model.search;
				if(text) {
					var path = '/search/tag/' + encodeURIComponent(text);
					console.log(path);
					$location.path(path);
				}

			};

		};

		return directive;
	});


	angular.module('reportingApp').directive('flagsearch', function (RestService,Functions,$location,ObservationService) {
		var directive = {};

		directive.restrict = 'E';
		directive.template = '<flags attributes = "all"></flags>';

		directive.scope = {

		};

		directive.link = function ($scope, element, attrs) {


			$scope.all = {reserve_ride:true,
				aad_fire:true,
				gear_malfunction:true,
				damage:true,
				gear_failure:true,
				packing_error:true,
				wilfull:true,
				violation:true,
				injury:true,
				death:true
			};



		};

		return directive;
	});


	angular.module('reportingApp').directive('searchformadvanced', function (RestService,Functions,$location,ObservationService) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/shared/directives/searchformadvanced.html";

		directive.scope = {

		};

		directive.link = function ($scope, element, attrs) {

			$scope.model = {};
			$scope.model.search = [];


			$scope.model.all = [];
			$scope.model.incident = [];
			$scope.model.situation = [];
			$scope.model.gear = [];



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