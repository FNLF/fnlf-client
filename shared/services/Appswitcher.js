(function () {
	angular.module('fnlf-services')
		.service('Appswitcher', function (RestService, $location, $rootScope) {

			this.getApps = function() {

				RestService.getApps()
					.then(function(data){

						var newArr = [];
						loc = window.location.pathname; //$location.absUrl();

						for (i=0; i < data.length; i++) {

							if(data[i]['url'] == "" || new RegExp(data[i]['url']).test(loc) == false || (data[i]['url'] == "/" && loc != "/")) {

								if(data[i]['icon'] == "") {
									data[i]['icon'] = "fa-plus";
								}

								var admins = [135597/3, 204597/3, 17298/3];

								if(data[i]['acl']['x'] == "true" || admins.indexOf(parseInt($rootScope.username)) > -1) {
									newArr.push(data[i]);
								};
							}
						}

						//Assign new array to nav
						$rootScope.nav.appswitcher = newArr;

						}).catch(function(error){
							console.log("ERROR in Application switcher service");
							console.log(error);
							deferred.reject(error);
						});

			};

			//this.getApps();
		});
})();