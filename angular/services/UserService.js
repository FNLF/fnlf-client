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
                $rootScope.authToken = authenticationResult.token64;


                if (rememberMe) {
                    $rootScope.rememberMe = true;
                    $cookieStore.put('authToken', authenticationResult.token64);
                    $cookieStore.put('username', username);

                }

               $http.defaults.headers.common.Authorization = 'Basic ' + authenticationResult.token64;

               $http.get('/api/v1/melwin/'+username)
               .success(function(user){
                    user.roles=[];
                    user.roles.push('user');
                    $rootScope.user=user;
                    $rootScope.username=username;
                  //  $location.path('/');
               }).error(function(error){
                console.log(error);
               });


            }).error(function(error){
                console.log(error);
            });
        }



        this.tryLoginFromCookie = function(){

            var username = $cookieStore.get('username');

            var token64 = $cookieStore.get('authToken');

            $http.defaults.headers.common.Authorization = 'Basic ' + token64;

            $http.get('/api/v1/melwin/'+username)
                       .success(function(user){
                            user.roles=[];
                            user.roles.push('user');
                            $rootScope.user=user;
                            $rootScope.username=username;
                       }).error(function(error){
                            $location.path("/");
                       });

        }
}]);