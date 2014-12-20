(function(){

angular.module('reportingApp')
	.service('PersonQueryService', ['$http', function($http) {
        var urlBase = '/api/v1';
        this.getPersonsByName = function(firstName) {

        	return $http.get(urlBase + '/melwin?where=firstname=='+firstName)
			};

     }]);

})();