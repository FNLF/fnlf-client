angular.module('reportingApp').directive('observationdateselector', function ($timeout) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "components/observation/directives/observationdateselector.html";

	directive.scope = {
		observation: '='
	};

	directive.link = function ($scope, element, attrs) {

		$scope.date = new Date();

      // Disable weekend selection
//      $scope.disabled = function(date, mode) {
//        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
//      };

//      $scope.toggleMin = function() {
//        $scope.minDate = $scope.minDate ? null : new Date();
//      };
//      $scope.toggleMin();

      $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
      };

//      $scope.dateOptions = {
//        formatYear: 'yy',
//        startingDay: 1
//      };

      $scope.dateOptions = {
    		    startingDay: 1,
    		    showWeeks: true
      };
      $scope.formats = ['yyyy-MM-dd', 'yyyy-MM-ddTHH:mm:ss', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];

      $scope.maxDate = new Date();
      $scope.minDate = new Date(2011,10,30);
      /** TIME **/
      $scope.hstep = 1;
      $scope.mstep = 1;

	};

	return directive;
});