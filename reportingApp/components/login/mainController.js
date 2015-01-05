(function () {
	/**
	 *
	 * @author: Tore Buer, s180346
	 * @author: Eivind Jacobsen, s173466
	 * @author: Morten Kristoffersen, s169440
	 *
	 * @since may.26.2014
	 *
	 */
	angular.module('reportingApp')
		.controller('MainController', function ($scope) {
			$scope.goToPage = function (url) {
				$location.path(url);
			};
		});

})();