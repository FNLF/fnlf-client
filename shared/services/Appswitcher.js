(function () {
	angular.module('fnlf-services')
		.service('Appswitcher', function (RestService, $location, $rootScope) {

			this.getApps = function() {

				RestService.getApps()
					.then(function(data){

						var newArr = [];
						for (i=0; i < data.length; i++) {

							if(data[i]['url'] == "/" || new RegExp(data[i]['url']).test($location.absUrl()) == false) {
								if(data[i]['icon'] == "") {
									data[i]['icon'] = "fa-plus";
								}
								newArr.push(data[i]);
							}
						}

						//Assign new array to nav
						$rootScope.nav.appswitcher = newArr;
						console.log(newArr);

						}).catch(function(error){
							console.log("ERROR in Application switcher service");
							console.log(error);
							deferred.reject(error);
						});

			};

			//this.getApps();
		});
})();