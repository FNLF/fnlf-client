(function () {

	var clubService = function (RestService) {
		var urlBase = '/api/v1';
		clubService.getClubs = function () {
			return [{name: 'Voss Fallskjermklubb', id: 'F1'}, {
				name: 'Bergen Fallskjermklubb',
				id: 'F2'
			}, {name: 'Grenland Fallskjermklubb', id: 'F3'}];
		};

		clubService.getLocations = function () {
			return [{name: 'Bømoen'}, {name: 'Stend'}, {name: 'Geiteryggen'}];
		};

	};
	angular.module('reportingApp').service('ClubService', ['$http', clubService]);
})();