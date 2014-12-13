anomalyApp.service('UserService', ['$http','$location','$cookieStore','$rootScope', function($http,$location,$cookieStore,$rootScope) {
        var urlBase = '/api/v1';

        this.getUser = function(username){
            return $http.get( '/api/v1/melwin/'+username);
        }

        this.authenticate = function(username,password,rememberMe){
            var data = {"username": username,"password": password};
            $http.post( '/api/v1/user/authenticate', data)
            .success(function(authenticationResult){
                console.log(authenticationResult);
                var authToken = authenticationResult.token;
                $rootScope.authToken = authenticationResult.token;
                $rootScope.token64 = authenticationResult.token64;

                if (rememberMe) {
                    $rootScope.rememberMe = true;
                    $cookieStore.put('token64', authToken);
                    $cookieStore.put('authToken', authToken);
                    $cookieStore.put('username', username);
                    $cookieStore.put('password', password);
                    $cookieStore.put('rememberMe', rememberMe);
                }

               $http.defaults.headers.common.Authorization = 'Basic ' + authenticationResult.token64;

               $http.get('/api/v1/melwin/'+username)
               .success(function(user){
                    user.roles=[];
                    user.roles.push('user');
                    $rootScope.user=user;
                    $location.path('/');
               }).error(function(error){
                console.log(error);
               });


            }).error(function(error){
                console.log(error);
            });
        }



        this.tryLoginFromCookie = function(){

        		 /* Try getting an authenticated user from cookie or go to login page */
        		var originalPath = $location.path();
        		//$location.path("/");
        		var authToken = $cookieStore.get('authToken');
        		var username = $cookieStore.get('username');
                var password = $cookieStore.get('password');


        		if (authToken !== undefined) {
                   // authenticate(username,password,true);
        		}

        }
}]);