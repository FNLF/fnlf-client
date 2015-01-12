angular.module('reportingApp').directive('locationselector', function (LocationService) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "reportingApp/components/observation/directives/locationselector.html";

	directive.scope = {
		observation: '='
	};

	directive.link = function ($scope, element, attrs) {

		$scope.locations = [];

		$scope.getLocations = function(name){
			return LocationService.getPlaceNames(name).then(function(response){
				if(response.data.stedsnavn){

					var array = [].concat(response.data.stedsnavn);
					return array.map(function(st){
						return {name:st.stedsnavn,descr:st.navnetype+', '+st.kommunenavn,east:st.aust,north:st.nord};
					});
			}else{
				return {};
			}
			});
		};

	};

	return directive;
});