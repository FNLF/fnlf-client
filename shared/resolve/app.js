
var resolve = angular.module('resolve', []).config(['$httpProvider', function ($httpProvider) {
	// enable http caching
	$httpProvider.defaults.cache = true;
}])