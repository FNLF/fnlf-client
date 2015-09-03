(function () {

	var observationstable = function (RestService,ngTableParams,$q,Definitions,ObservationService,$location) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/components/main/directives/observationstable.html";

		directive.scope = {
			kind: '=' //all,todo,my
		};

		directive.link = function ($scope, element, attrs) {


			$scope.getTags = function() {
				console.log("GET TAGS");
				var def = $q.defer();
				var tags = [{title:'Reservetrekk',id:'Reservetrekk'}];
				def.resolve(tags);
				return def;

			};

			$scope.getClubs = function(){
				console.log("GET CLUBS");
				var def = $q.defer();

				RestService.getClubs().then(function(r){
					var data = r.data;
					var items = data._items;
					var clubs = items.map(function(club){
						return {id:club.id,title:club.name};
					});
					def.resolve(clubs);
				});

				//var clubs = [{title:'VFSK',id:'F-001'}];
				//return clubs;

				return def;
			};

			$scope.tableParams = new ngTableParams({
					page: 1,            // show first page
					count: 10,           // count per page
					sorting: {
						id: 'desc'     // initial sorting
					}
				},
				{
					total: 1,
					getData: function($defer, params) {


						var sortString = "-id";
						angular.forEach(params.sorting(),function(k,v){
							if(k=='desc') {
								sortString = '-' + v;
							}

							if(k=='asc'){
								sortString = v;
							}
							console.log(sortString);
						});

						console.log(params.filter());


						var observationsFn = RestService.getAllObservations;;

						if($scope.kind == 'all'){
							observationsFn = RestService.getAllObservations;
						}

						if($scope.kind == 'my'){
							observationsFn = RestService.getAllObservations;
						}

						if($scope.kind == 'todo'){
							observationsFn = RestService.getAllObservations;
						}

						if(observationsFn){
							observationsFn(params.page(),params.count(),sortString)
								.success(function(r){
									var meta = r._meta;
									params.total(meta.total);
									var data = r._items
									$defer.resolve(data);
								});

						}else{
							console.log("No kind");
						}


					}

				}
			);




			$scope.resolveObservationType = function(id) {

				return Definitions.resolveObservationTypes(id);
			};
			$scope.resolveWorkflowState = function(state) {

				return Definitions.resolveObservationWorkflowState(state);
			};

			$scope.editObservation = function(_id){
				console.log("Edit");
				RestService.getObservation(_id).success(function(item){

					$scope.observation = item;
					ObservationService.setObservation($scope.observation);

					if($scope.observation.workflow.state == 'closed') {
						$location.path("/observation/report/"+item.id);
					}
					else {
						$location.path("/observation/"+item.id);
					}
				});

			};

		};

		return directive;
	};

	angular.module('reportingApp').directive('observationstable', observationstable);

})();

