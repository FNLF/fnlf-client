(function () {
	
	angular.module('reportingApp')
		.service('InvolvedService', ['RestService', function (RestService) {
			
			this.getUserDetails = function (user) {
				return RestService.getUserDetails(user.id)
					.then(function (data) {
						user.membership = data.membership;
						user.licenses = data.licenses;
						return data;
					});
			};
			
			this.getUserGearAndjumps = function (user){
				if(user.id && user.id > 0){
					RestService.getUser(user.id)
						.then(function (user) {
							var settings = user.settings;
							if (settings.total_jumps) {
								user.numberOfJumps = settings.total_jumps;
							}
							if (settings.gear) {
								user.gear = settings.gear;
							}
						});
				}
				
			};
		
		}]);
	
})();
