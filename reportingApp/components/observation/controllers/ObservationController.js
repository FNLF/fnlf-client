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
			}

			$scope.items=[
				new ItemType('location','Legg til sted'),
				new ItemType('involved','Legg til involverte personer'),
				new ItemType('components','Legg til observasjonsforløp')
			];

		$scope.saveObservation = function () {
			ObservationService.updateObservation();
		};


		});

})();