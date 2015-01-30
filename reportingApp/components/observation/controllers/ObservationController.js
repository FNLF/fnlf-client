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
		.controller('ObservationController',
		function ($scope, ObservationService) {

			$scope.observation = ObservationService.getObservation();

			var ItemType = function ItemType(type,label){
				this.type=type;
				this.label=label;
				this.used=false;
			};

			$scope.items=[
				new ItemType('location','Sted'),
				new ItemType('organization','Hoppfeltorganisering'),
				new ItemType('involved','Involverte personer'),
				new ItemType('components','Observasjonsforløp')
			];

		$scope.saveObservation = function () {
			ObservationService.updateObservation();
		};

		/**
		 * How can we watch changes?
		 * 
		 * Triggers saved/unsaved label
		 */
		$scope.observationChanges = false;
		$scope.$watch('observation', function() {
			
			$scope.observationChanges = true;
		});

		});

})();