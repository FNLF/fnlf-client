/**
 * Angled Navbar
 */

 angular.module('angled-navbar.directives',['ngSanitize', 'ui.bootstrap'])

 	.directive('angledNavbar',[function(){
 		return {
 			restrict : 'AE',
 			scope : {
 				brand : '=',
 				menus : '=',
 				affixed : '=',
 				search : '=',
 				inverse : '=',
 				searchfn : '&',
 				navfn : '&',
 				loggedin : '=',
 				toolbar : '='
 			},
 			templateUrl : '/static/js/angled/template.html',
 			controller : function($scope,$element,$attrs){

 				//== Scope/Attributes Defaults ==//

 				$scope.defaults = {
 					brand : '<span class="glyphicon glyphicon-certificate"></span>',
 					menus : [],
 					search : {
 						show: false
 					}
 				}; // end defaults

 				//-- Attribute Check --//

 				/* if no parent function was passed to directive for navfn or 
 				 * searchfn, then create one to emit an event
 				 */

 				if(angular.isUndefined($attrs.navfn)){
 					$scope.navfn = function(action){
 						if(angular.isObject(action))
 							$scope.$emit('angled-navbar.menu',action);
 						else
 							$scope.$emit('angled-navbar.menu',{'action' : action});
 					}; // end navfn
 				}

 				if(angular.isUndefined($attrs.searchfn)){
 					$scope.searchfn = function(){
 						$scope.$emit('angled-navbar.search.execute');
 					}; // end searchfn
 				}

 				//-- Methods --//

 				$scope.noop = function(){
 					angular.noop();
 				}; // end noop

 				/**
 				 * Navigation Action
 				 * Navigation menu items will call this function which in turn will
 				 * use the passed in navfn or emit an action for the parent to handle.
 				 * @param		string		action
 				 */
 				$scope.navAction = function(action){
 					$scope.navbarCollapsed=false;
					$scope.navfn({'action' : action});
 				}; // end navAction

 				/**
 				 * Have Branding
 				 * Checks to see if the brand attibute was passed, if not use the default.
 				 * @result 		string
 				 */
 				$scope.haveBranding = function(){
 					return (angular.isDefined($attrs.brand)) ? $scope.brand : $scope.defaults.brand;
 				}; // end haveBranding

 				/**
 				 * Has Menus
 				 * Checks to see if there were menus passed in for the navbar.
 				 * @result		boolean
 				 */
 				$scope.hasMenus = function(){
 					return (angular.isDefined($attrs.menus));
 				}; // end hasMenus

 				/**
 				 * Has Dropdown Menu
 				 * Check to see if navbar item should have a dropdown menu.
 				 * @param		object 		menu
 				 * @result		boolean
 				 */
 				$scope.hasDropdownMenu = function(menu){
 					return (angular.isDefined(menu.menu) && angular.isArray(menu.menu));
 				}; // end hasDropdownMenu

 				/**
 				 * Is Divider
 				 * Check to see if dropdown menu item is to be a menu divider.
 				 * @param		object 		item
 				 * @result		boolean
 				 */
 				$scope.isDivider = function(item){
 					return (angular.isDefined(item.divider) && angular.equals(item.divider,true));
 				}; // end isDivider

 			} // end controller
 		}; // end return
 	}]); // end angledNavbar

